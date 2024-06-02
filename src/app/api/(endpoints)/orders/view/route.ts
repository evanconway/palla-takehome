import { getOrderFunctions, getCartFunctions } from "@/app/api/model";

export async function GET() {
  const carts = await getCartFunctions();
  const orderFuncs = await getOrderFunctions();
  const cartId = await carts.GET_USER_CART_ID(); // would be in a cookie or something in serious version
  const orders = orderFuncs.ordersGetByCartId(cartId);
  return Response.json(orders);
}
