"use client";

import { Order, centsToDollarString } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const g = async () => {
      const data = await fetch(`${domain}/api/orders/view`);
      const ordersData = (await data.json()) as Order[];
      setOrders(ordersData);
    };
    g();
  }, [setOrders]);

  return (
    <main className="p-4">
      <h1 className="text-xl">Your Orders</h1>
      {orders === null ? (
        <div>loading...</div>
      ) : orders.length <= 0 ? (
        <div>no orders</div>
      ) : (
        <ul className="mt-8">
          {orders.map((order, i) => {
            const date = new Date(order.date);
            const hour = date.getHours();
            const displayHour = hour % 12 || 12;
            const minute = date.getMinutes().toLocaleString("en-US", {
              minimumIntegerDigits: 2,
            });
            const anteMeridiem = hour >= 13 ? "PM" : "AM";

            return (
              <li key={i} className="my-6">
                <div>{`${date.toDateString()}`}</div>
                <div>{`${displayHour}:${minute}${anteMeridiem}`}</div>
                <div>{centsToDollarString(order.amountInCents)}</div>
              </li>
            );
          })}
        </ul>
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}
