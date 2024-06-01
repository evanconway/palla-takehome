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

export const inventoryCreateProduct = (newProduct: NewProduct) => {
  const newId = uuid();
  inventory.set(newId, { id: newId, ...newProduct });
  console.log(inventory);
  return newId;
};

export const inventoryDeleteProductById = (productId: string) => {
  const result = inventory.delete(productId);
  console.log(inventory);
  return result;
};
