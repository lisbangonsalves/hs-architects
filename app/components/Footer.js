"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Studio Info */}
          <div className="space-y-2">
            <p
              className="text-sm font-medium text-gray-900"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              HS Architects
            </p>
            <p className="text-xs text-gray-600">Architecture + Interior Design</p>
            <p className="text-xs text-gray-600">Mumbai / Alibaug</p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              href="/practice"
              className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Practice
            </Link>
            <Link
              href="/projects"
              className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/studio"
              className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Studio
            </Link>
            <Link
              href="/contact"
              className="block text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            © {year} HS Architects. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
