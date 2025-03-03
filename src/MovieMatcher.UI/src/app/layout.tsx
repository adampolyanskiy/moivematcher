import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
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
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
