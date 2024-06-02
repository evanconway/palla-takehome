import { Order, centsToDollarString } from "@/app/(pages)/clientUtil";
import { domain } from "@/app/util";
import Link from "next/link";

export default async function Page() {
  const data = await fetch(`${domain}/api/orders/view`);
  const orders = (await data.json()) as Order[];

  return (
    <main className="p-4">
      <h1 className="text-xl">Your Orders</h1>
      {orders.length <= 0 ? (
        <div>no orders</div>
      ) : (
        orders.map((order, i) => (
          <li key={i}>
            <div>{order.date.toISOString()}</div>
            <div>${centsToDollarString(order.amountInCents)}</div>
          </li>
        ))
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}
