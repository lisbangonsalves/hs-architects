"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Practice", href: "/practice" },
    { label: "Projects", href: "/projects" },
    { label: "Studio", href: "/studio" },
    { label: "Contact", href: "/contact" },
  ];

  // Transparent initial state on all pages; solid after scroll
  const hasSolidBackground = isScrolled;
  const isHome = pathname === "/";
  const isProjects = pathname === "/projects";
  
  // On home page with white background, use black text when not scrolled
  // On projects page with white background, use dark text
  const textColor = (isHome && !isScrolled) || (isProjects && !isScrolled) ? "text-gray-900" : "text-white";
  const textOpacity = isActive => isActive ? "opacity-100" : "opacity-80";

  const getLinkClassName = (isActive) => {
    const baseClasses = "text-sm tracking-wider transition-opacity hover:opacity-60";
    return `${baseClasses} ${textColor} ${textOpacity(isActive)}`;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          hasSolidBackground ? "bg-[#0b0b0d]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            {/* Logo - Serif font */}
            <Link
              href="/"
              className={`text-lg sm:text-xl hover:opacity-70 transition-opacity ${textColor}`}
              style={{ fontFamily: "var(--font-serif), serif" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              HS Architects
            </Link>

            {/* Desktop Navigation links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={getLinkClassName(isActive)}
                    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-opacity hover:opacity-60 ${textColor}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden transition-all duration-300 bg-[#0b0b0d]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="flex flex-col h-full pt-20 px-6">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-4 text-lg tracking-wider transition-opacity hover:opacity-60 border-b border-gray-800 ${
                    isActive ? "text-white opacity-100" : "text-white opacity-80"
                  }`}
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
