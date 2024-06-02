import { inventoryView } from "@/app/api/model";
import { storageGetFuncs } from "@/app/api/testNodePersist";

export async function GET(req: Request) {
  const s = await storageGetFuncs();
  await s.incrementCounter();
  console.log(await s.getCounter());

  const params = new URL(req.url).searchParams;
  const paramPage = params.get("page");
  const paramSearch = params.get("search");
  const page = paramPage === null ? 0 : parseInt(paramPage);
  const search = paramSearch === null ? "" : paramSearch;
  return Response.json(inventoryView(page, search));
}
