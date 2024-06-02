import { v4 as uuid } from "uuid";
import storage from "node-persist";

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

const PRODUCTS_PER_PAGE = 6;

export interface ProductView {
  firstPage: number;
  lastPage: number;
  currentPage: number;
  products: Product[];
}

export const getInventoryFunctions = async () => {
  // initialize
  const k = "inventory";
  await storage.init();
  if ((await storage.getItem(k)) === undefined) {
    console.log("inventory does not exist, creating...");
    const result = await storage.setItem(k, {});
    console.log(result);
  }

  const inventory = await storage.getItem(k);

  const inventoryAllValues = () =>
    Object.values(inventory).map((p) => p as Product);

  return {
    inventoryCreateProduct: (newProduct: NewProduct) => {
      const newId = uuid();
      inventory[newId] = { id: newId, ...newProduct } as Product;
      return newId;
    },
    inventoryAllValues,
    inventoryDeleteProductById: (productId: string) => {
      const result = inventory[productId];
      delete inventory.productId;
      return result;
    },
    inventoryView: (page = 0, search = "") => {
      const allProductsMatchingSearch = inventoryAllValues().filter(
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
    },
    inventoryViewProductById: (id: string) => {
      const result = inventory[id];
      return result === undefined ? undefined : (result as Product);
    },
  };
};

interface Cart {
  id: string;
  products: Map<string, number>; // mapping of product IDs to count
}

// @ts-ignore
if (!global.carts) {
  // @ts-ignore
  global.carts = new Map<string, Cart>();
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

export const cartProductGetCount = async (
  cartId: string,
  productId: string,
) => {
  const inv = await getInventoryFunctions();

  const cart = carts.get(cartId);
  if (cart === undefined) return -1;
  if (inv.inventoryViewProductById(productId) === undefined) return -1; // product does not exist
  const count = cart.products.get(productId);
  return count === undefined ? 0 : count;
};

export const cartProductAdd = async (
  cartId: string,
  productId: string,
  count: number,
) => {
  const inv = await getInventoryFunctions();

  const cart = carts.get(cartId);
  if (cart === undefined) return -1;
  const productInventoryCount = inv.inventoryViewProductById(productId)?.count;
  if (productInventoryCount === undefined) return -1;
  const alreadyInCart = await cartProductGetCount(cartId, productId);
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

export const cartGetTotal = async (cartId: string) => {
  const inv = await getInventoryFunctions();
  const cart = carts.get(cartId);
  if (cart === undefined) return 0;
  return Array.from(cart.products.keys())
    .map((productId) => {
      const product = inv.inventoryViewProductById(productId)!;
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

export const orderCreateFromCart = async (cartId: string) => {
  const inv = await getInventoryFunctions();
  const cart = carts.get(cartId);
  if (cart === undefined) return false;
  if (cart.products.size <= 0) return false;
  const orderTotal = await cartGetTotal(cartId);
  const orderId = uuid();

  // remove stock from inventory
  cart.products.forEach((count, productId) => {
    const product = inv.inventoryViewProductById(productId);
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
