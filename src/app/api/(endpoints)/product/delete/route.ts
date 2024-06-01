import { inventoryDeleteProductById } from "../../../model";

export async function DELETE(req: Request) {
  const { productId } = await req.json();
  if (productId === undefined) {
    return new Response(null, { status: 400 });
  }
  const success = inventoryDeleteProductById(productId);
  return new Response(null, { status: success ? 200 : 400 });
}
