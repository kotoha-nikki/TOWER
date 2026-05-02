import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Tower Map",
  description:
    "An editorial high-rise map for tracking signal, culture, and market gravity across the Solana ecosystem.",
  metadataBase: new URL("https://www.towermap.fun")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
