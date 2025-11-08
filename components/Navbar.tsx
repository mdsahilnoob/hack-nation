"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "https://github.com/", label: "GitHub", external: true },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <Link href="/" className="text-xl font-semibold text-indigo-600">
            SkillSense
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-indigo-600 transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* CTA button */}
          <Link
            href="/#upload"
            className="hidden md:inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Get Started
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden mt-2 pb-4 space-y-2">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-700 hover:text-indigo-600"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-700 hover:text-indigo-600"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/#upload"
              onClick={() => setOpen(false)}
              className="block bg-indigo-600 text-white text-center py-2 rounded-lg mt-2"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
