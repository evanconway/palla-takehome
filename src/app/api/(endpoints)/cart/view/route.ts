import {
  cartView,
  inventoryViewProductById,
  USER_CART_ID,
} from "@/app/api/model";

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

export async function GET(req: Request) {
  const cartId = USER_CART_ID; // would bein a cookie or something in serious version
  const cart = cartView(cartId);
  const result: CartView = { products: [], totalInCents: 0 };
  if (cart === undefined) return Response.json(result);
  result.products = Array.from(cart.products.keys()).map((productId) => {
    const product = inventoryViewProductById(productId)!;
    const count = cart.products.get(productId)!;
    return {
      id: product.id,
      name: product.name,
      priceInCents: product.priceInCents,
      subTotalInCents: product.priceInCents * count,
      imgURL: product.imageURL,
      count: cart.products.get(productId)!,
    };
  });
  result.totalInCents = Array.from(cart.products.keys())
    .map((productId) => {
      const product = inventoryViewProductById(productId)!;
      const count = cart.products.get(productId)!;
      return count * product.priceInCents;
    })
    .reduce((prev, curr) => prev + curr, 0);
  return Response.json(result);
}
