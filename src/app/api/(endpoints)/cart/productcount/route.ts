import { getCartFunctions } from "@/app/api/model";

export async function GET(req: Request) {
  const carts = await getCartFunctions();
  const params = new URL(req.url).searchParams;
  const paramProductId = params.get("id");
  const productId = paramProductId === null ? "" : paramProductId;
  const result = carts.cartProductGetCount(
    await carts.GET_USER_CART_ID(),
    productId,
  );
  return Response.json({ count: result });
}
