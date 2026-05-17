"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Shield } from "lucide-react";
import { motion } from "motion/react";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/menu", label: "Menu" },
    { href: "/order", label: "Order" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-secondary border-b border-primary font-mono text-xs uppercase tracking-widest flex items-stretch h-[48px]">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <div
            key={link.href}
            className="flex-1 min-w-0 border-r border-primary relative group flex"
          >
            <Link
              href={link.href}
              className={`flex w-full h-full items-center justify-center text-center transition-colors relative z-10 ${isActive ? "text-secondary" : "text-primary hover:text-secondary hover:bg-primary/90"}`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </div>
        );
      })}

      <div className="flex items-center h-full">
        <Link
          href="/dashboard/user"
          className={`px-4 h-full flex items-center justify-center transition-colors border-l border-primary group relative ${pathname.startsWith("/dashboard/user") ? "text-secondary bg-obsession" : "text-secondary bg-primary hover:text-secondary"}`}
          title="User Dashboard"
        >
          <User
            size={16}
            className="relative z-10 group-hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-obsession scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 -z-0"></div>
        </Link>
        <Link
          href="/dashboard/admin"
          className={`px-4 h-full flex items-center justify-center transition-colors border-l border-[#403e3c] group relative ${pathname.startsWith("/dashboard/admin") ? "text-secondary bg-obsession" : "text-secondary bg-primary hover:text-secondary"}`}
          title="Admin Dashboard"
        >
          <Shield
            size={16}
            className="relative z-10 group-hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-obsession scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-300 -z-0"></div>
        </Link>
      </div>
    </nav>
  );
}
