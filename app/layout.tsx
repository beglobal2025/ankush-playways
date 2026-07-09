import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import RouteChangeLoader from "@/components/RouteChangeLoader";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ankushplayways.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ANKUSH Playways | Kids Play Equipment Catalogue",
    template: "%s | ANKUSH Playways",
  },
  description:
    "Explore ANKUSH Playways indoor play equipment, school furniture, toys, ride-ons, slides, ball pools, and learning products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <RouteChangeLoader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
