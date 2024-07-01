import type { Metadata } from "next";
import "./global.css";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
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

            <div id="footer" className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
                <div className="mx-auto max-w-4xl py-4 px-8 text-center flex justify-center items-center gap-8 mb-4">
                  <span>
                    <FaGithub size={"2rem"}/>
                  </span>
                  <span>
                    <FaTwitter size={"2rem"}/>
                  </span>
                  <span>
                    <FaLinkedin size={"2rem"}/>
                  </span>
                </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
