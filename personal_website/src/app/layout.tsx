import React from "react";
import "@/app/globals.css"; // must be at the top
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sion Gang",
  description: "Music & Code Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {/* <Navbar /> */}
        <main className="flex-grow bg-black">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
