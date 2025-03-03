import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/global.css";
import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "sonner";

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
            <div className="fixed inset-0 -z-10 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 dark:from-sky-600 dark:via-sky-700 dark:to-indigo-800 blur-3xl"></div>
            </div>
            <header className="absolute top-4 right-4">
              <ModeToggle />
            </header>

            {children}
            <Toaster/>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
