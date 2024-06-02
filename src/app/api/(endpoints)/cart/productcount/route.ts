import { getCartFunctions } from "@/app/api/model";

export async function GET(req: Request) {
  const carts = await getCartFunctions();
  const params = new URL(req.url).searchParams;
  const paramProductId = params.get("id");
  const productId = paramProductId === null ? "" : paramProductId;
  const cartId = await carts.GET_USER_CART_ID();
  const result = await carts.cartProductGetCount(cartId, productId);
  return Response.json({ count: result });
}
