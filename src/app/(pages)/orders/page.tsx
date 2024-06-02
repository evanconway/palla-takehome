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
        <ul className="mt-8">
          {orders.map((order, i) => {
            const date = new Date(order.date);
            console.log(date);
            return (
              <li key={i} className="my-6">
                <div>{`${date.toDateString()}`}</div>
                <div>${centsToDollarString(order.amountInCents)}</div>
              </li>
            );
          })}
        </ul>
      )}
      <Link href={`${domain}`}>Browse Products</Link>
    </main>
  );
}