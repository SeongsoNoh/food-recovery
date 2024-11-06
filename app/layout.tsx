import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Food Re:Covery",
    default: "Food Re:Covery",
  },
  description: "Sell and buy all the foods!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          type="text/javascript"
          strategy="beforeInteractive"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.MAP_ID}&submodules=geocoder`}
        />
      </head>
      <body
        className={`${inter.className} bg-main-color text-black max-w-screen-sm mx-auto`}
        suppressContentEditableWarning
      >
        {children}
      </body>
    </html>
  );
}
