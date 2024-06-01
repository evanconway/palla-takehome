import { inventoryAllValues } from "@/app/api/model";

export async function GET(req: Request) {
  return Response.json(inventoryAllValues());
}
