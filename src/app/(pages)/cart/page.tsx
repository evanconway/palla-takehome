"use client";

import { CartView } from "@/app/api/(endpoints)/cart/view/route";
import { USER_CART_ID } from "@/app/api/model";
import { domain } from "@/app/util";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cartId =
    searchParams && typeof searchParams["id"] === "string"
      ? searchParams["id"]
      : "";

  const [cartView, setCartView] = useState<CartView | null>(null);

  const fetchCart = async () => {
    const cartURL = new URL(`${domain}/api/cart/view?=${cartId}`);
    cartURL.searchParams.set("id", USER_CART_ID);
    const data = await (await fetch(cartURL)).json();
    setCartView(data as CartView);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <main className="p-4">
      <h1 className="text-xl">Your Cart</h1>
      {cartView === null ? (
        <div>loading...</div>
      ) : (
        <div className="my-8">
          <ul>
            {cartView.products.map((product, i) => (
              <li key={i} className="my-4">
                <div>{product.name}</div>
                <img src={product.imgURL}></img>
                <div>${product.priceInCents / 100}</div>
                <div>count: {product.count}</div>
                <div>{`Subtotal (${product.count} items): $${product.subTotalInCents / 100}`}</div>
                <button
                  onClick={async () => {
                    await fetch(`${domain}/api/cart/delete`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productId: product.id,
                      }),
                    });
                    fetchCart();
                  }}
                >
                  Remove From Cart
                </button>
              </li>
            ))}
          </ul>
          <div className="text-xl">TOTAL: ${cartView.totalInCents / 100}</div>
        </div>
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}
