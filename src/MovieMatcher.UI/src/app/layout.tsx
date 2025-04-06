import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/global.css";
import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "sonner";
import { Suspense } from "react";
import { Spotlight } from "@/components/ui/spotlight-new";

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
            <main className="min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
