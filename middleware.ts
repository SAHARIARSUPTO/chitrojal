import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  verifySessionToken,
} from "./lib/session";

const STAFF_ALLOWED_ADMIN_PAGES = [
  "/admin",
  "/admin/events",
  "/admin/event-managements",
  "/admin/staff",
  "/admin/poses",
  "/admin/photo-drive",
  "/admin/pose-library",
];

function isUnderPath(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

function isStaffAllowedAdminPage(pathname: string) {
  return STAFF_ALLOWED_ADMIN_PAGES.some((route) => isUnderPath(pathname, route));
}

function isAdminOnlyPage(pathname: string) {
  return pathname.startsWith("/admin") && pathname !== "/admin/login" && !isStaffAllowedAdminPage(pathname);
}

function isAdminOnlyApi(pathname: string) {
  return (
    isUnderPath(pathname, "/api/admin/staff") ||
    isUnderPath(pathname, "/api/admin/orders") ||
    isUnderPath(pathname, "/api/admin/invoices") ||
    isUnderPath(pathname, "/api/admin/finance") ||
    isUnderPath(pathname, "/api/admin/payments") ||
    isUnderPath(pathname, "/api/admin/photo-drive") ||
    isUnderPath(pathname, "/api/orders") ||
    isUnderPath(pathname, "/api/order") ||
    isUnderPath(pathname, "/api/invoices") ||
    isUnderPath(pathname, "/api/finance") ||
    isUnderPath(pathname, "/api/payments") ||
    isUnderPath(pathname, "/api/photo-drive") ||
    isUnderPath(pathname, "/api/staff") ||
    pathname === "/api/upload"
  );
}

function isReadOnlyApi(pathname: string) {
  return (
    pathname === "/api/admin/dashboard" ||
    pathname === "/api/admin/staff-features" ||
    pathname === "/api/events" ||
    isUnderPath(pathname, "/api/events/") ||
    pathname === "/api/poses" ||
    isUnderPath(pathname, "/api/poses/") ||
    pathname === "/api/folders" ||
    isUnderPath(pathname, "/api/folders/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isAdminPage = pathname.startsWith("/admin");
  const isApi = pathname.startsWith("/api");

  if (!isAdminPage && !isApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (session.accessRole === "admin") {
    return NextResponse.next();
  }

  if (isAdminPage && isAdminOnlyPage(pathname)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isApi) {
    const isStaffAllowedGet =
      request.method === "GET" &&
      (isUnderPath(pathname, "/api/admin/staff") ||
        isUnderPath(pathname, "/api/staff") ||
        isUnderPath(pathname, "/api/admin/photo-drive") ||
        isUnderPath(pathname, "/api/photo-drive") ||
        isUnderPath(pathname, "/api/event-managements") ||
        isUnderPath(pathname, "/api/admin/event-managements"));

    if (isStaffAllowedGet) {
      return NextResponse.next();
    }

    if (isAdminOnlyApi(pathname)) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }

    if (isReadOnlyApi(pathname) && request.method !== "GET") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
