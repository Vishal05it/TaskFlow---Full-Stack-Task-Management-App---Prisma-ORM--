import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const cookieStore = req.cookies;
  const token = cookieStore.get("sessionToken");
  console.log("Token is : ", token);
  const { pathname } = req.nextUrl;
  const isPublicRoute =
    pathname == "/login" ||
    pathname == "/signup" ||
    pathname == "/forgotpassword" ||
    pathname == "/resetpassword" ||
    pathname.startsWith("/verifyaccount");
  if (!token && !isPublicRoute)
    return NextResponse.redirect(new URL("/login", req.url));
  if (token && isPublicRoute)
    return NextResponse.redirect(new URL("/", req.url));
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/createtask",
    "/editprofile",
    "/profile",
    "/updatetask/:path*",
    "/",
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
    "/verifyaccount/:path*",
    "/changepassword",
  ],
};
