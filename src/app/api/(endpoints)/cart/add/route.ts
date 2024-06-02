import { NextRequest } from "next/server";
import { USER_CART_ID, cartProductAdd } from "@/app/api/model";

export async function POST(req: NextRequest) {
  const cartId = USER_CART_ID;
  if (cartId === undefined) return;
  const { productId, count } = (await req.json()) as {
    productId: string;
    count: number;
  };
  const newCount = cartProductAdd(cartId, productId, count);
  return Response.json({ productId, newCount });
}
