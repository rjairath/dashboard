import type { Metadata } from "next";
import "./global.css";
import Link from 'next/link';
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Next Dashboard",
  description: "Has portfolio and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div id="content" className="flex-1 scroll-auto p-2">
              {children}
            </div>

            <div id="footer" className="bg-blue-500 text-white p-2 dark:bg-slate-700">
              <span>
                &copy; {new Date().getFullYear()} Dashboard. All rights
                reserved.
              </span>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
