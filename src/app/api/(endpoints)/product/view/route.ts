import { getInventoryFunctions } from "@/app/api/model";

export async function GET(req: Request) {
  const inv = await getInventoryFunctions();
  const params = new URL(req.url).searchParams;
  const paramProductId = params.get("id");
  const productId = paramProductId === null ? "" : paramProductId;
  const result = inv.inventoryViewProductById(productId);
  return Response.json(result === undefined ? {} : result);
}
