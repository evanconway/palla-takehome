import { orderCreateFromCart, getCartFunctions } from "@/app/api/model";

export async function POST() {
  const carts = await getCartFunctions();
  const cartId = await carts.GET_USER_CART_ID(); // would be in a cookie or something in serious version
  const success = orderCreateFromCart(cartId);
  return Response.json({ success });
}
