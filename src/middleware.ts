import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cartCreate } from "./app/api/model";

const cartIdCookieName = "cartId";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // console.log("HIT URL:" + req.url);
  const cookieOnReq = req.cookies.getAll();
  // console.log("cookies on request:");
  // console.log(cookieOnReq);

  // set cookies
  const res = NextResponse.next();
  if (!cookieOnReq.find((c) => c.name === cartIdCookieName)) {
    const newCartId = cartCreate();
    res.cookies.set(cartIdCookieName, newCartId);
  }

  // const cookieOnRes = res.cookies.getAll();
  // console.log("cookies on response:");
  // console.log(cookieOnRes);

  return res;
}
