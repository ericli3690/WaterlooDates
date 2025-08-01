import React from "react";
import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Waterloo Dates",
  description: "Looking for soulmates? Use WaterlooDates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const isHomepage = pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased ${isHomepage ? '' : 'pt-16'}`}
      >
        <MantineProvider>
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
