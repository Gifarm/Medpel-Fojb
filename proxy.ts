import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isJurnalisRoute = pathname.startsWith("/jurnalis");
  const isKolRoute = pathname.startsWith("/kol"); // <-- BARU: Deteksi rute KOL
  const isLoginPage = pathname === "/login";

  // 1. Belum login tapi mau akses route protected -> Redirect ke Login
  if ((isAdminRoute || isJurnalisRoute || isKolRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. STRICT ROLE PROTECTION (Pemisahan Ketat)

  // Jika mau akses Admin, HARUS role ADMIN
  if (isAdminRoute && role !== "ADMIN") {
    if (role === "JURNALIS")
      return NextResponse.redirect(new URL("/jurnalis/dashboard", request.url));
    if (role === "KOL")
      return NextResponse.redirect(new URL("/kol/dashboard", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika mau akses Jurnalis, HARUS role JURNALIS
  if (isJurnalisRoute && role !== "JURNALIS") {
    if (role === "ADMIN")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "KOL")
      return NextResponse.redirect(new URL("/kol/dashboard", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Jika mau akses KOL, HARUS role KOL <-- BARU
  if (isKolRoute && role !== "KOL") {
    if (role === "ADMIN")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "JURNALIS")
      return NextResponse.redirect(new URL("/jurnalis/dashboard", request.url));
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Jika sudah login tapi masih nekat buka halaman /login -> Redirect ke dashboard masing-masing
  if (isLoginPage && token) {
    if (role === "ADMIN")
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "JURNALIS")
      return NextResponse.redirect(new URL("/jurnalis/dashboard", request.url));
    if (role === "KOL")
      return NextResponse.redirect(new URL("/kol/dashboard", request.url)); // <-- BARU
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Tentukan route mana saja yang akan dipantau <-- UPDATED
export const config = {
  matcher: ["/admin/:path*", "/jurnalis/:path*", "/kol/:path*", "/login"],
};
