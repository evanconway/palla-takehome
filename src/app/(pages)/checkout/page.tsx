"use client";

import { CartView, centsToDollarString } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
  const router = useRouter();

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

  const [finalizing, setFinalizing] = useState(false);

  if (cartView === null) return <div>loading...</div>;
  if (cartView.products.length <= 0) redirect(`${domain}`);

  return (
    <main className="p-4">
      <div className="flex flex-col gap-8">
        <h1 className="text-xl">Checkout</h1>
        <div className="text-xl">
          TOTAL: {centsToDollarString(cartView.totalInCents)}
        </div>
        {finalizing ? (
          <div>finalizing...</div>
        ) : (
          <div>
            <button
              onClick={async () => {
                setFinalizing(true);
                await fetch(`${domain}/api/orders/create`, {
                  method: "POST",
                });
                router.push(`${domain}/orders`);
              }}
            >
              Finalize Purchase
            </button>
          </div>
        )}
        <div>
          <Link href={`${domain}/cart`}>Go back to Cart</Link>
        </div>
        <div>
          <Link href={`${domain}`}>Go back to Browse Products</Link>
        </div>
      </div>
    </main>
  );
}
