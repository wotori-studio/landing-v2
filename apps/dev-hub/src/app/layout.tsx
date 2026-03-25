import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dev hub — landing-v2",
  description: "Local links to monorepo apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
