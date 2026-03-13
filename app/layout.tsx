import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LITHOFINDER - Natural Stone Slab Marketplace",
  description: "Search and discover natural stone slabs from suppliers nationwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* GitHub Pages SPA redirect: restores the URL encoded by 404.html */}
        <Script id="spa-redirect" strategy="beforeInteractive">{`
          (function() {
            var params = new URLSearchParams(window.location.search);
            var redirectPath = params.get('p');
            if (redirectPath) {
              var url = window.location.pathname.replace(/\\/$/, '') + redirectPath;
              window.history.replaceState(null, '', url);
            }
          })();
        `}</Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
