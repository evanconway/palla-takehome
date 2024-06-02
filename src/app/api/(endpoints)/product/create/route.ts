import {
  NewProduct,
  getInventoryFunctions,
  isValidNewProduct,
} from "../../../model";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const inv = await getInventoryFunctions();

  const newProduct = (await req.json()) as NewProduct;
  if (!isValidNewProduct(newProduct)) {
    return new Response(null, { status: 400 });
  }
  const newId = inv.inventoryCreateProduct(newProduct);
  revalidatePath("/", "layout");
  return Response.json({ newProductId: newId });
}
