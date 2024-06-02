import { ordersGetByCartId, USER_CART_ID } from "@/app/api/model";

export async function GET() {
  const cartId = USER_CART_ID; // would be in a cookie or something in serious version
  const orders = ordersGetByCartId(cartId);
  return Response.json(orders);
}
