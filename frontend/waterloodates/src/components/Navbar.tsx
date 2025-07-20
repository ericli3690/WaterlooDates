"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/rizzume', label: 'Rizzumé' },
        { href: '/wingman', label: 'Wingman' },
    ];

    if (pathname === '/') {
        return null; // Don't render Navbar on the home page
    }

    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3a2a33] text-gray-100 shadow-md h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/dashboard" className="text-2xl font-bold text-[#ff76e8]">
              <span className="text-[#ffda23]">Waterloo</span>
              <span className="text-[#ff76e8]">Dates</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-4">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? 'text-[#664e5b] bg-[#ff76e8]'
                        : 'text-gray-200 hover:text-[#ff76e8] hover:bg-[#33242e]'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}

              {/* Logout as a normal <a> */}
              <a
                href="/auth/logout"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-200 hover:text-[#664e5b] hover:bg-[#ffda23] transition"
              >
                Log out
              </a>
            </div>
          </div>
        </div>
      </nav>
    );
}