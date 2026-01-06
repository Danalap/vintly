import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vintly | Secondhand Fashion Marketplace",
  description: "Discover unique pre-loved fashion. Buy and sell secondhand clothing with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


