import { getCartFunctions } from "@/app/api/model";

export async function DELETE(req: Request) {
  const carts = await getCartFunctions();
  const cartId = await carts.GET_USER_CART_ID(); // would bein a cookie or something in serious version
  const { productId } = await req.json();
  const result = carts.cartProductRemove(cartId, productId as string);
  return Response.json({ removed: result });
}
