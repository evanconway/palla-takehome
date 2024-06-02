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
  const productId =
    searchParams && typeof searchParams["id"] === "string"
      ? searchParams["id"]
      : "";

  const backToBrowse = <Link href={`${domain}`}>Back to Browsing</Link>;

  const [itemIsInCart, setItemIsInCart] = useState<null | number>(null);

  const fetchItemIsInCart = async () => {
    const inCartURL = new URL(`${domain}/api/cart/productcount`);
    inCartURL.searchParams.set("id", productId);
    const data = await (await fetch(inCartURL)).json();
    const hasInCart = data["count"] as number;
    setItemIsInCart(hasInCart);
  };

  useEffect(() => {
    fetchItemIsInCart();
  }, [fetchItemIsInCart]);

  const [product, setProduct] = useState<Product | null | "notfound">(null);
  const [amountToPurchase, setAmountToPurchase] = useState(1);

  useEffect(() => {
    const g = async () => {
      const productURL = new URL(`${domain}/api/product/view`);
      productURL.searchParams.set("id", productId);
      const data = await (await fetch(productURL)).json();
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
        {itemIsInCart ? <div>Item already in cart</div> : null}
        <button
          onClick={async () => {
            await fetch(`${domain}/api/cart/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: product.id,
                count: amountToPurchase,
              }),
            });
            fetchItemIsInCart();
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
