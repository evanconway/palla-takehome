import { getInventoryFunctions } from "@/app/api/model";
import { storageGetFuncs } from "@/app/api/testNodePersist";

export async function GET(req: Request) {
  const s = await storageGetFuncs();
  await s.incrementCounter();
  console.log(await s.getCounter());

  const inv = await getInventoryFunctions();

  const params = new URL(req.url).searchParams;
  const paramProductId = params.get("id");
  const productId = paramProductId === null ? "" : paramProductId;
  const result = inv.inventoryViewProductById(productId);
  return Response.json(result === undefined ? {} : result);
}
