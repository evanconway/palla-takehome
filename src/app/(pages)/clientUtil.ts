const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  currencyDisplay: "narrowSymbol",
});

export const centsToDollarString = (cents: number) =>
  currencyFormatter.format(cents / 100);

export interface CartView {
  products: {
    id: string;
    name: string;
    priceInCents: number;
    subTotalInCents: number;
    imgURL: string;
    count: number;
  }[];
  totalInCents: number;
}

export interface Product {
  id: string;
  count: number;
  name: string;
  imageURL?: string;
  description: string;
  priceInCents: number;
}

export interface ProductView {
  firstPage: number;
  lastPage: number;
  currentPage: number;
  products: Product[];
}

export interface Order {
  cartId: string;
  id: string;
  amountInCents: number;
  date: string; // Date objects come through as strings after json.stringify();
}
