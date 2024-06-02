import { v4 as uuid } from "uuid";
import { seedData } from "./testData";

export interface NewProduct {
  name: string;
  imageURL: string;
  description: string;
  priceInCents: number;
  count: number;
}

export const isValidNewProduct = (possibleProduct: any) => {
  if (possibleProduct["name"] === undefined) return false;
  if (possibleProduct["imageURL"] === undefined) return false;
  if (possibleProduct["description"] === undefined) return false;
  if (possibleProduct["priceInCents"] === undefined) return false;
  if (possibleProduct["count"] === undefined || possibleProduct["count"] < 0)
    return false;
  return true;
};

export interface Product extends NewProduct {
  id: string;
  count: number;
}

let seedingRequired = false;
// @ts-ignore
if (!global.inventory) {
  // @ts-ignore
  global.inventory = new Map<string, Product>();
  seedingRequired = true;
}

// @ts-ignore
const inventory = global.inventory as Map<string, Product>;

export const inventoryCreateProduct = (newProduct: NewProduct) => {
  const newId = uuid();
  inventory.set(newId, { id: newId, ...newProduct });
  return newId;
};

// seed for development
// if (seedingRequired) {
//   console.log("----------running seed code----------");
//   seedData.forEach((p) => console.log(inventoryCreateProduct(p as NewProduct)));
// }

export const inventoryAllValues = () => Array.from(inventory.values());

export const inventoryDeleteProductById = (productId: string) => {
  const result = inventory.delete(productId);
  return result;
};

const PRODUCTS_PER_PAGE = 6;

export interface ProductView {
  firstPage: number;
  lastPage: number;
  currentPage: number;
  products: Product[];
}

export const inventoryView = (page = 0, search = "") => {
  const allProductsMatchingSearch = Array.from(inventory.values()).filter(
    (p) => p.count > 0 && p.name.includes(search),
  );

  const indexStart = (page < 0 ? 0 : page) * PRODUCTS_PER_PAGE;
  const indexEnd = indexStart + PRODUCTS_PER_PAGE;

  const products = allProductsMatchingSearch.slice(indexStart, indexEnd);

  const result: ProductView = {
    firstPage: 0,
    lastPage: Math.max(
      0,
      Math.ceil(allProductsMatchingSearch.length / PRODUCTS_PER_PAGE) - 1,
    ),
    currentPage: page,
    products,
  };

  return result;
};

export const inventoryViewProductById = (id: string) => inventory.get(id);

interface Cart {
  id: string;
  products: Map<string, number>; // mapping of product IDs to count
}

// @ts-ignore
if (!global.carts) {
  // @ts-ignore
  global.carts = new Map<string, Product>();
}

// @ts-ignore
const carts = global.carts as Map<string, Cart>;

const cartCreate = () => {
  const newCartId = uuid();
  carts.set(newCartId, { id: newCartId, products: new Map() });
  return newCartId;
};

// @ts-ignore
if (!global.userCartId) {
  // @ts-ignore
  global.userCartId = cartCreate();
}

// @ts-ignore
export const USER_CART_ID = global.userCartId as string;

export const cartProductGetCount = (cartId: string, productId: string) => {
  const cart = carts.get(cartId);
  if (cart === undefined) return -1;
  if (!inventory.has(productId)) return -1; // product does not exist
  const count = cart.products.get(productId);
  return count === undefined ? 0 : count;
};

export const cartProductAdd = (
  cartId: string,
  productId: string,
  count: number,
) => {
  const cart = carts.get(cartId);
  if (cart === undefined) return -1;
  const productInventoryCount = inventory.get(productId)?.count;
  if (productInventoryCount === undefined) return -1;
  const alreadyInCart = cartProductGetCount(cartId, productId);
  if (alreadyInCart < 0) return -1;
  const newCount = alreadyInCart + count;
  cart.products.set(productId, newCount);
  return newCount;
};

export const cartView = (cartId: string) => carts.get(cartId);

export const cartProductRemove = (cartId: string, productId: string) => {
  const cart = carts.get(cartId);
  if (cart === undefined) return false;
  cart.products.delete(productId);
  return true;
};

export const cartGetTotal = (cartId: string) => {
  const cart = carts.get(cartId);
  if (cart === undefined) return 0;
  return Array.from(cart.products.keys())
    .map((productId) => {
      const product = inventoryViewProductById(productId)!;
      const count = cart.products.get(productId)!;
      return count * product.priceInCents;
    })
    .reduce((prev, curr) => prev + curr, 0);
};

export interface Order {
  cartId: string;
  id: string;
  amountInCents: number;
  date: Date;
}

// @ts-ignore
if (!global.orders) {
  // @ts-ignore
  global.orders = new Map<string, Map<string, Order>>(); // mapping of cartIds to map of Orders
}

// @ts-ignore
const orders = global.orders as Map<string, Map<string, Order>>;

export const orderCreateFromCart = (cartId: string) => {
  const cart = carts.get(cartId);
  if (cart === undefined) return false;
  if (cart.products.size <= 0) return false;
  const orderTotal = cartGetTotal(cartId);
  const orderId = uuid();

  // remove stock from inventory
  cart.products.forEach((count, productId) => {
    const product = inventory.get(productId);
    if (product === undefined) return;
    product.count -= count;
  });

  // clear cart
  cart.products.clear();

  // create orderMap for cart if not exists
  if (!orders.has(cartId)) {
    orders.set(cartId, new Map<string, Order>());
  }

  const cartOrders = orders.get(cartId)!;
  const order: Order = {
    cartId,
    id: orderId,
    amountInCents: orderTotal,
    date: new Date(),
  };

  cartOrders.set(order.id, order);

  return true;
};

export const ordersGetByCartId = (cartId: string) => {
  const cartOrders = orders.get(cartId);
  if (cartOrders === undefined) return [] as Order[];
  const result = Array.from(cartOrders.keys()).map((orderId) => {
    return cartOrders.get(orderId)!;
  });
  return result;
};
