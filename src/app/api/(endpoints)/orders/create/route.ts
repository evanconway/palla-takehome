import { orderCreateFromCart, USER_CART_ID } from "@/app/api/model";

export async function POST() {
  const cartId = USER_CART_ID; // would be in a cookie or something in serious version
  const success = orderCreateFromCart(cartId);
  return Response.json({ success });
}
