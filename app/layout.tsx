import type { Metadata, Viewport } from "next";

import brCobane from "@/fonts";

import "./globals.css";

import { AppProvider } from "./provider";

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://google.com/"),
  title: { default: "Home", template: `%s | E-Homez` },
  description:
    "Manage and organising property listing and asset on xx property",
  icons: {
    icon: [
      {
        url: "../public/mainlogo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  keywords: "manage company, organization app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={brCobane.variable}>
        <div id="drawer-root"></div>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
