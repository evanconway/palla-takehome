import { v4 as uuid } from "uuid";

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

const inventory = new Map<string, Product>();

export const inventoryAllValues = () => Array.from(inventory.values());

export const inventoryCreateProduct = (newProduct: NewProduct) => {
  const newId = uuid();
  inventory.set(newId, { id: newId, ...newProduct });
  return newId;
};

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
      Math.floor(allProductsMatchingSearch.length / PRODUCTS_PER_PAGE) - 1,
    ),
    currentPage: page,
    products,
  };

  return result;
};

export const inventoryViewProductById = (id: string) => inventory.get(id);

// seed for development
import { seedData } from "./testData";
console.log("----------running seed code----------");
seedData.forEach((p) => inventoryCreateProduct(p as NewProduct));
import { getDB } from "@/db";
const getDBTime = getDB().getDBTime;
console.log("DB time: ", getDBTime());

interface Cart {
  id: string;
  products: Map<string, number>; // mapping of product IDs to count
}

const carts = new Map<string, Cart>();

const cartCreate = () => {
  const newCartId = uuid();
  carts.set(newCartId, { id: newCartId, products: new Map() });
  return newCartId;
};

export const USER_CART_ID = cartCreate();

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
