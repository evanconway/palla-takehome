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

  const inventory = (await storage.getItem(k)) as Record<string, Product>;

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
      delete inventory[productId];
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
  products: Record<string, number>; // mapping of product IDs to count
}

export const getCartFunctions = async () => {
  // initialize
  const k = "carts";
  await storage.init();
  if ((await storage.getItem(k)) === undefined) {
    console.log("carts does not exist, creating...");
    const result = await storage.setItem(k, {}); // originally Map<string, Cart>
    console.log(result);
  }

  const carts = (await storage.getItem(k)) as Record<string, Cart>;

  const getCartById = (cartId: string) => {
    const result = carts[cartId];
    if (result === undefined) return undefined;
    return result;
  };

  const cartProductGetCount = async (cartId: string, productId: string) => {
    const inv = await getInventoryFunctions();

    const cart = getCartById(cartId);
    if (cart === undefined) return -1;
    if (inv.inventoryViewProductById(productId) === undefined) return -1; // product does not exist
    const count = cart.products[productId];
    return count === undefined ? 0 : count;
  };

  const cartCreate = () => {
    const newCartId = uuid();
    carts[newCartId] = { id: newCartId, products: {} };
    return newCartId;
  };

  const userCartId = "userCartId";
  if ((await storage.getItem(userCartId)) === undefined) {
    console.log("user cart id does not exist, creating user cart");
    const result = await storage.setItem(userCartId, cartCreate());
    console.log(result);
  }

  return {
    GET_USER_CART_ID: async () => await storage.getItem(userCartId),
    getCartById,
    cartCreate,
    cartProductGetCount,
    cartProductAdd: async (
      cartId: string,
      productId: string,
      count: number,
    ) => {
      const inv = await getInventoryFunctions();

      const cart = getCartById(cartId);
      if (cart === undefined) return -1;
      const productInventoryCount =
        inv.inventoryViewProductById(productId)?.count;
      if (productInventoryCount === undefined) return -1;
      const alreadyInCart = await cartProductGetCount(cartId, productId);
      if (alreadyInCart < 0) return -1;
      const newCount = alreadyInCart + count;
      cart.products[productId] = newCount;
      return newCount;
    },
    cartView: (cartId: string) => getCartById(cartId),
    cartProductRemove: (cartId: string, productId: string) => {
      const cart = getCartById(cartId);
      if (cart === undefined) return false;
      delete cart.products[productId];
      return true;
    },
    cartGetTotal: async (cartId: string) => {
      const inv = await getInventoryFunctions();
      const cart = getCartById(cartId);
      if (cart === undefined) return 0;
      return Object.keys(cart.products)
        .map((productId) => {
          const product = inv.inventoryViewProductById(productId)!;
          const count = cart.products[productId]!;
          return count * product.priceInCents;
        })
        .reduce((prev, curr) => prev + curr, 0);
    },
  };
};

export interface Order {
  cartId: string;
  id: string;
  amountInCents: number;
  date: string; // need to use for storing as JSON, use ISO 8601 format
}

export const getOrderFunctions = async () => {
  // initialize
  const k = "orders";
  await storage.init();
  if ((await storage.getItem(k)) === undefined) {
    console.log("orders does not exist, creating...");
    // mapping of cartIds to map of Orders
    const result = await storage.setItem(k, {}); // originally Map<string, Map<string, Order>>
    console.log(result);
  }

  // mapping of cartIds to map of Orders
  const orders = (await storage.getItem(k)) as Record<
    string,
    Record<string, Order>
  >;

  const getCartById = (cartId: string) => {
    const result = orders[cartId];
    if (result === undefined) return undefined;
    return result;
  };

  return {
    orderCreateFromCart: async (cartId: string) => {
      const inv = await getInventoryFunctions();
      const carts = await getCartFunctions();
      const cart = carts.getCartById(cartId);
      if (cart === undefined) return false;
      if (cart.products.size <= 0) return false;
      const orderTotal = await carts.cartGetTotal(cartId);
      const orderId = uuid();

      // remove stock from inventory
      Object.keys(cart.products).forEach((productId) => {
        const product = inv.inventoryViewProductById(productId);
        if (product === undefined) return;
        const count = cart.products[productId];
        product.count -= count;
      });

      // clear cart
      cart.products = {};

      // create orderMap for cart if not exists
      if (getCartById(cartId) === undefined) {
        orders[cartId] = {};
      }
      const cartOrders = getCartById(cartId)!;
      const order: Order = {
        cartId,
        id: orderId,
        amountInCents: orderTotal,
        date: new Date().toISOString(),
      };
      cartOrders[order.id] = order;
      return true;
    },
    ordersGetByCartId: (cartId: string) => {
      const cartOrders = getCartById(cartId);
      if (cartOrders === undefined) return [] as Order[];
      const result = Object.keys(cartOrders).map((orderId) => {
        return cartOrders[orderId]!;
      });
      return result;
    },
  };
};
