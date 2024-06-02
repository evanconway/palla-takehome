"use client";

import { CartView } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

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
  if (cartView.products.length <= 0) redirect(`${domain}`);

  return (
    <main className="p-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl">Checkout</h1>
        <div className="text-xl">TOTAL: ${cartView.totalInCents / 100}</div>
        <div>
          <button
            onClick={async () => {
              await fetch(`${domain}/api/orders/create`, {
                method: "POST",
              });
              router.push(`${domain}/orders`);
            }}
          >
            Finalize Purchase
          </button>
        </div>
        <div>
          <Link href={`${domain}`}>No, go back to Browse Products</Link>
        </div>
      </div>
    </main>
  );
}
