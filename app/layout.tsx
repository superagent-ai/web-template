import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "",
  description: "",
  openGraph: {
    type: "website",
    url: "",
    title: "",
    description: "",
    siteName: "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased bg-[#292929]",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
