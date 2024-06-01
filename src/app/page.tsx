import Link from "next/link";
import { ProductView } from "./api/model";
import { domain } from "./util";

export default async function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const url = new URL(`${domain}/api/product/browse`);
  url.searchParams.set(
    "page",
    searchParams && typeof searchParams["page"] === "string"
      ? searchParams["page"]
      : "0",
  );
  url.searchParams.set(
    "search",
    searchParams && typeof searchParams["search"] === "string"
      ? searchParams["search"]
      : "",
  );
  const { products, currentPage, firstPage, lastPage } = (await (
    await fetch(url)
  ).json()) as ProductView;

  const pageNavigator = (
    <div className="flex flex-row gap-4">
      <Link href={`/?page=${firstPage}`}>First Page</Link>
      <Link href={`/?page=${Math.max(firstPage, currentPage - 1)}`}>
        Previous Page
      </Link>
      <div>{currentPage}</div>
      <Link href={`/?page=${Math.min(lastPage, currentPage + 1)}`}>
        Next Page
      </Link>
      <Link href={`/?page=${lastPage}`}>Last Page</Link>
    </div>
  );

  const productDisplay =
    products.length <= 0 ? (
      <div>{"no products :("}</div>
    ) : (
      <div>
        {pageNavigator}
        <ul>
          {products.map((p) => (
            <li key={p.id} className="mb-4 ">
              <div>{p.name}</div>
              <img src={p.imageURL}></img>
              <div>${p.priceInCents / 100}</div>
              <Link href={`${domain}/product?id=${p.id}`}>View Product</Link>
            </li>
          ))}
        </ul>
        {pageNavigator}
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Product View</div>
      {productDisplay}
    </main>
  );
}
