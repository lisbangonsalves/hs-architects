"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Home page", href: "/admin/home" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Studio", href: "/admin/studio" },
    { label: "Contact", href: "/admin/contact" },
    { label: "Manage Users", href: "/admin/users" },
  ];

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 sm:p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6 lg:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close menu"
            >
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
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
