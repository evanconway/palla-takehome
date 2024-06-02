import { revalidatePath } from "next/cache";
import { getOrderFunctions, getCartFunctions } from "@/app/api/model";

export async function POST() {
  const carts = await getCartFunctions();
  const orders = await getOrderFunctions();
  const cartId = await carts.GET_USER_CART_ID(); // would be in a cookie or something in serious version
  const success = await orders.orderCreateFromCart(cartId);
  revalidatePath("/orders");
  return Response.json({ success });
}
