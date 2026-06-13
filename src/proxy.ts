import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_ROUTES } from "./constants/routes/admin.routes";

export function proxy(req: NextRequest) {
  const disableAuth = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
  const pathname = req.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(ADMIN_ROUTES.DASHBOARD, req.url));
  }
  // 🔥 Bypass auth completely
  if (disableAuth) {
    return NextResponse.next();
  }

  const token = req.cookies.get("refreshToken")?.value;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === ADMIN_ROUTES.LOGIN;

  // 🚫 Not logged in
  if (isAdminRoute && !isLoginPage && !token) {
    // allow unknown routes to pass
    if (!pathname.startsWith(ADMIN_ROUTES.LOGIN)) {
      return NextResponse.redirect(new URL(ADMIN_ROUTES.LOGIN, req.url));
    }
  }

  //  Already logged in
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL(ADMIN_ROUTES.DASHBOARD, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],  
};
