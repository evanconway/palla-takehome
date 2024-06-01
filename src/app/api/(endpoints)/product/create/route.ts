import {
  NewProduct,
  inventoryCreateProduct,
  isValidNewProduct,
} from "../../../model";

export async function POST(req: Request) {
  const newProduct = (await req.json()) as NewProduct;
  if (!isValidNewProduct(newProduct)) {
    return new Response(null, { status: 400 });
  }
  const newId = inventoryCreateProduct(newProduct);
  return Response.json({ newProductId: newId });
}
