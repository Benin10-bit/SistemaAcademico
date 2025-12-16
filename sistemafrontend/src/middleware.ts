import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  { path: "/sign-in", whenAuthenticated: "redirect" },
  { path: "/register", whenAuthenticated: "redirect" },
  { path: "/termos-e-privacidade", whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/sign-in";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const publicUrl = publicRoutes.find((route) => url === route.path);
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token && !publicUrl) {
    const redirectPath = request.nextUrl.clone();
    redirectPath.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

    return NextResponse.redirect(redirectPath);
  }

  if (token && publicUrl) {
    if (publicUrl.whenAuthenticated === "redirect") {
      const redirectPath = request.nextUrl.clone();
      redirectPath.pathname = "/";

      return NextResponse.redirect(redirectPath);
    }

    return NextResponse.next();
  }

  if (token && !publicUrl) {
    //Verifica se o jwt está expirado

    // Decodifica o token
    const decoded = jwtDecode<{ exp: number }>(token);

    // Pega a data de expiração
    const exp = decoded.exp; // em segundos

    // Data atual em segundos
    const now = Math.floor(Date.now() / 1000);

    if (exp < now) {
      // Token expirado
      const redirectPath = request.nextUrl.clone();
      redirectPath.pathname = "/sign-in";
      return NextResponse.redirect(redirectPath);
    }
  }
  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}