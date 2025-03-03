import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "Movie Matcher",
  description: "Find movies with your friends that you'll both love",
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
