import { Product } from "@/app/api/model";
import { domain } from "@/app/util";
import Link from "next/link";

export default async function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const url = new URL(`${domain}/api/product/view`);
  url.searchParams.set(
    "id",
    searchParams && typeof searchParams["id"] === "string"
      ? searchParams["id"]
      : "",
  );
  const response = await fetch(url);

  const data = await response.json();

  const backToBrowse = <Link href={`${domain}`}>Back to Browsing</Link>;

  if (data === undefined)
    return (
      <div>
        <div>no product with that id</div>
        {backToBrowse}
      </div>
    );

  const product = data as Product;

  return (
    <div>
      <div>{product.name}</div>
      <img src={product.imageURL}></img>
      <div>${product.priceInCents / 100}</div>
      <p>{product.description}</p>
      {backToBrowse}
    </div>
  );
}
