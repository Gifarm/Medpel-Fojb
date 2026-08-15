import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isJurnalisRoute = pathname.startsWith("/jurnalis");
  const isLoginPage = pathname === "/login";

  // 1. Belum login tapi mau akses route protected -> Redirect ke Login
  if ((isAdminRoute || isJurnalisRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. STRICT ROLE PROTECTION (Pemisahan Ketat)

  // Jika mau akses Admin, HARUS role ADMIN
  if (isAdminRoute && role !== "ADMIN") {
    // Kalau yang coba masuk adalah Jurnalis, lempar ke dashboard Jurnalis
    if (role === "JURNALIS") {
      return NextResponse.redirect(new URL("/jurnalis/dashboard", request.url));
    }
    // Selain itu (Member/KOL), lempar ke homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika mau akses Jurnalis, HARUS role JURNALIS
  if (isJurnalisRoute && role !== "JURNALIS") {
    // Kalau yang coba masuk adalah Admin (yang iseng), lempar balik ke dashboard Admin
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    // Selain itu (Member/KOL), lempar ke homepage
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Jika sudah login tapi masih nekat buka halaman /login -> Redirect ke dashboard masing-masing
  if (isLoginPage && token) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "JURNALIS") {
      return NextResponse.redirect(new URL("/jurnalis/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang akan dipantau
export const config = {
  matcher: ["/admin/:path*", "/jurnalis/:path*", "/login"],
};
