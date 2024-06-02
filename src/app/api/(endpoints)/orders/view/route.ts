import { ordersGetByCartId, getCartFunctions } from "@/app/api/model";

export async function GET() {
  const carts = await getCartFunctions();
  const cartId = await carts.GET_USER_CART_ID(); // would be in a cookie or something in serious version
  const orders = ordersGetByCartId(cartId);
  return Response.json(orders);
}
