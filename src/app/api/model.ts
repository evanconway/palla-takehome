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
seedData.forEach((p) => inventoryCreateProduct(p as NewProduct));

interface Cart {
  id: string;
  products: Map<string, Product>;
}

const carts = new Map<string, Cart>();

export const cartCreate = () => {
  const newCartId = uuid();
  carts.set(newCartId, { id: newCartId, products: new Map() });
  return newCartId;
};
