"use client";

import { CartView } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [cartView, setCartView] = useState<CartView | null>(null);

  const fetchCart = async () => {
    const cartURL = new URL(`${domain}/api/cart/view`);
    const data = await (await fetch(cartURL)).json();
    setCartView(data as CartView);
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (cartView === null) return <div>loading...</div>;

  return (
    <main className="p-4">
      {cartView === null ? (
        <div>loading...</div>
      ) : (
        <div>
          <h1 className="text-xl">Checkout</h1>
          <div className="text-xl">TOTAL: ${cartView.totalInCents / 100}</div>
        </div>
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}
