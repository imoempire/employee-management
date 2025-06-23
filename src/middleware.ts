import { auth } from "./auth";

export default auth((req) => {
  // Protect all routes except public ones
  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (!isPublicRoute && !req.auth) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/:path*", "/dashboard"],
};
