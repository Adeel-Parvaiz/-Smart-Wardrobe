import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/wardrobe/:path*",
    "/outfits/:path*",
    "/profile/:path*",
    "/api/wardrobe/:path*",
    "/api/outfits/:path*",
  ],
};
