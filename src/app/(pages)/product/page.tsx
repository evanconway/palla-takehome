"use client";

import { Product } from "@/app/api/model";
import { domain } from "@/app/util";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const backToBrowse = <Link href={`${domain}`}>Back to Browsing</Link>;
  const url = new URL(`${domain}/api/product/view`);
  url.searchParams.set(
    "id",
    searchParams && typeof searchParams["id"] === "string"
      ? searchParams["id"]
      : "",
  );

  const [product, setProduct] = useState<Product | null | "notfound">(null);
  const [amountToPurchase, setAmountToPurchase] = useState(1);

  useEffect(() => {
    const g = async () => {
      const data = await (await fetch(url)).json();
      if (data["id"] === undefined) setProduct("notfound");
      else setProduct(data as Product);
    };
    g();
  }, [setProduct]);

  if (product === null) return <div>loading...</div>;

  if (product === "notfound")
    return (
      <div>
        <div>no product with that id</div>
        {backToBrowse}
      </div>
    );

  return (
    <main className="p-4">
      <h1>{product.name}</h1>
      <img src={product.imageURL}></img>
      <div>${product.priceInCents / 100}</div>
      <p>{product.description}</p>
      <div>{product.count} left in stock</div>
      <br />
      <div className="flex gap-4">
        <button
          onClick={async () => {
            const newCount = await fetch(`${domain}/api/cart/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: product.id,
                count: amountToPurchase,
              }),
            });
          }}
        >
          Add To Cart
        </button>
        <input
          className="text-black"
          type="number"
          min="1"
          max={product.count}
          value={amountToPurchase}
          onChange={(e) => {
            setAmountToPurchase(parseInt(e.target.value));
          }}
        ></input>
      </div>
      <br />
      {backToBrowse}
    </main>
  );
}
