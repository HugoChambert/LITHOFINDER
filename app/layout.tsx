import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/lib/theme-context";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
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
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <Header />
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
