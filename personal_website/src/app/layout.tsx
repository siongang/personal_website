import React from "react";
import "./globals.css"; // <-- this is what ensures your scrollbar CSS applies globally
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Sion Gang",
  description: "Music & Code Portfolio",
  icons: {
    icon: "/njs.jpg", // or .ico or other formats
  },
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
