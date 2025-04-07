"use client";

type NavButtonProps = {
  href: string;
  children: React.ReactNode;
};
export default function NavButton({ href, children }: NavButtonProps) {
  return (
    <a
      href={href}
      className="border border-white px-6 py-2 rounded hover:bg-white hover:text-black transition"
    >
      {children}
    </a>
  );
}
