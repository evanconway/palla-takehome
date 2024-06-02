import { getInventoryFunctions } from "@/app/api/model";

export async function GET(req: Request) {
  const inv = await getInventoryFunctions();
  return Response.json(await inv.inventoryAllValues());
}
