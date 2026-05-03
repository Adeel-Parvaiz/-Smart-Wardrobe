import type { Metadata } from "next";
import "./globals.css"; // wait nahi -- src/styles/globals.css import karo
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Smart Wardrobe",
  description: "Manage your wardrobe digitally and plan outfits",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}