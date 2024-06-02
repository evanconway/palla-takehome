import { cartProductRemove, USER_CART_ID } from "@/app/api/model";

export async function DELETE(req: Request) {
  const cartId = USER_CART_ID; // would bein a cookie or something in serious version
  const { productId } = await req.json();
  const result = cartProductRemove(cartId, productId as string);
  return Response.json({ removed: result });
}
