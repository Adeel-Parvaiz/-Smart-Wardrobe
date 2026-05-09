import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    return;
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        if (path.startsWith("/admin")) {
          return token?.role === "ADMIN";
        }

        if (path.startsWith("/wardrobe") || path.startsWith("/outfits")) {
          return !!token;
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/wardrobe/:path*", "/outfits/:path*", "/admin/:path*", "/profile/:path*"],
};
