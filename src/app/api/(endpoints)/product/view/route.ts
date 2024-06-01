import { inventoryView } from "@/app/api/model";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const paramPage = params.get("page");
  const paramSearch = params.get("search");
  const page = paramPage === null ? 0 : parseInt(paramPage);
  const search = paramSearch === null ? "" : paramSearch;
  console.log(`page: ${page}, search: "${search}"`);
  return Response.json(inventoryView(page, search));
}
