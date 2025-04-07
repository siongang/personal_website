'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Logo / Name */}
        <Link href="/" className="text-xl font-semibold hover:text-gray-300">
          Sion Gang
        </Link>

        {/* Right: Nav Links */}
        <div className="space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-gray-400">Home</Link>
          <Link href="/projects" className="hover:text-gray-400">Projects</Link>
          <Link href="/music" className="hover:text-gray-400">Music</Link>
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
