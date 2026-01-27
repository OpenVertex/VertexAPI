import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Vertex Status - ACG API Manager",
  description: "Beautiful API management system with anime style",
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {/* Fixed Background */}
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{ 
            backgroundImage: "url('https://t.alcy.cc/ycy')",
            filter: "brightness(0.7) blur(12px)",
            transform: "scale(1.1)" // Scale up slightly to hide blurred edges
          }}
        />
        
        {/* Darker overlay to improve readability */}
        <div className="fixed inset-0 z-[-1] bg-black/10" />
        <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-sakura-light/10 to-sky-light/10 backdrop-blur-[2px]" />

        <main className="min-height-screen p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
