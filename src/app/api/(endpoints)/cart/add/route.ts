import { NextRequest } from "next/server";
import { getCartFunctions } from "@/app/api/model";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const carts = await getCartFunctions();
  const cartId = await carts.GET_USER_CART_ID();
  if (cartId === undefined) return;
  const { productId, count } = (await req.json()) as {
    productId: string;
    count: number;
  };
  const newCount = await carts.cartProductAdd(cartId, productId, count);
  revalidatePath("/", "layout");
  return Response.json({ productId, newCount });
}
