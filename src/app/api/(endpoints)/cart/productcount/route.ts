import { USER_CART_ID, cartProductGetCount } from "@/app/api/model";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const paramProductId = params.get("id");
  const productId = paramProductId === null ? "" : paramProductId;
  const result = cartProductGetCount(USER_CART_ID, productId);
  return Response.json({ count: result });
}
