"use client";

import { CartView, centsToDollarString } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const [cartView, setCartView] = useState<CartView | null>(null);

  const fetchCart = useMemo(() => {
    return async () => {
      const cartURL = new URL(`${domain}/api/cart/view`);
      const data = await (await fetch(cartURL)).json();
      setCartView(data as CartView);
    };
  }, [setCartView]);

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
                <div>{centsToDollarString(product.priceInCents)}</div>
                <div>count: {product.count}</div>
                <div>{`Subtotal (${product.count} items): ${centsToDollarString(product.subTotalInCents)}`}</div>
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
          <div className="text-xl">
            TOTAL: {centsToDollarString(cartView.totalInCents)}
          </div>
          {cartView.products.length <= 0 ? null : (
            <Link className="text-xl" href={`${domain}/checkout`}>
              Checkout
            </Link>
          )}
        </div>
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}
