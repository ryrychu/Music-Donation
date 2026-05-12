import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mara Vale - Night Signal",
  description: "Pay what you want to unlock the full digital album.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
