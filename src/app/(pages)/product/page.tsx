"use client";

import { Product, centsToDollarString } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  const productId =
    searchParams && typeof searchParams["id"] === "string"
      ? searchParams["id"]
      : "";

  const backToBrowse = <Link href={`${domain}`}>Back to Browsing</Link>;

  const [itemIsInCart, setItemIsInCart] = useState<null | number>(null);

  const fetchItemIsInCart = useMemo(() => {
    return async () => {
      const inCartURL = new URL(`${domain}/api/cart/productcount`);
      inCartURL.searchParams.set("id", productId);
      const data = await (await fetch(inCartURL)).json();
      const hasInCart = data["count"] as number;
      setItemIsInCart(hasInCart);
    };
  }, [setItemIsInCart]);

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
      <div>{centsToDollarString(product.priceInCents)}</div>
      <p>{product.description}</p>
      <div>{product.count} left in stock</div>
      <br />
      <div className="flex gap-4">
        {itemIsInCart ? (
          <div>
            Item in cart. <Link href={`${domain}/cart`}>View Cart</Link>
          </div>
        ) : (
          <div>
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
                router.push(`${domain}/cart`);
                fetchItemIsInCart();
              }}
            >
              Add To Cart
            </button>
            <select
              className="text-black ml-4"
              value={amountToPurchase}
              onChange={(e) => {
                const userValue = parseInt(e.target.value);
                const value = Number.isNaN(userValue)
                  ? 1
                  : Math.max(userValue, 1);
                setAmountToPurchase(Math.min(product.count, value));
              }}
            >
              {new Array(product.count).fill(0).map((_, i) => (
                <option value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <br />
      {backToBrowse}
    </main>
  );
}
