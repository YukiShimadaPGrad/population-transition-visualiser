import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "modern-css-reset/dist/reset.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "人口推移見えーるくん",
  description: "各都道府県の人口推移を可視化するアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
