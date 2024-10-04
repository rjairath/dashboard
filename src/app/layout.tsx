import type { Metadata } from "next";
import "./global.css";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              if(window.localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
                window.localStorage.setItem("theme", 'dark');
              } else {
                document.documentElement.classList.remove('dark')
              }
            `
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />

            <div id="content" className="flex flex-1 scroll-auto">
              {children}
            </div>
            
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
