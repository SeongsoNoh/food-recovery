import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
      <body
        className={`${inter.className} bg-white text-black max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
