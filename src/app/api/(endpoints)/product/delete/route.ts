import { inventoryDeleteProductById } from "../../../model";
import { revalidatePath } from "next/cache";

export async function DELETE(req: Request) {
  const { productId } = await req.json();
  if (productId === undefined) {
    return new Response(null, { status: 400 });
  }
  const success = inventoryDeleteProductById(productId);
  revalidatePath("/", "layout");
  return new Response(null, { status: success ? 200 : 400 });
}
