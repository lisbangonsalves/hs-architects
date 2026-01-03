"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = {
    projects: [
      { label: "Residential", href: "/projects/residential" },
      { label: "Commercial", href: "/projects/commercial" },
      { label: "Industrial", href: "/projects/industrial" },
      { label: "Hospitality", href: "/projects/hospitality" },
      { label: "Healthcare", href: "/projects/healthcare" },
      { label: "Educational", href: "/projects/educational" },
      { label: "Mixed Use", href: "/projects/mixed-use" },
      { label: "Cultural", href: "/projects/cultural" },
      { label: "All Projects", href: "/projects" },
    ],
    about: [
      { label: "Our Story", href: "/about/story" },
      { label: "Team", href: "/about/team" },
      { label: "Awards", href: "/about/awards" },
      { label: "Careers", href: "/about/careers" },
      { label: "Press", href: "/about/press" },
      { label: "Sustainability", href: "/about/sustainability" },
    ],
    contact: [
      { label: "Office Locations", href: "/contact/locations" },
      { label: "Email Us", href: "/contact/email" },
      { label: "Phone", href: "/contact/phone" },
      { label: "Request Quote", href: "/contact/quote" },
      { label: "Newsletter", href: "/contact/newsletter" },
    ],
  };

  const getColumns = (items) => {
    const itemsPerColumn = Math.ceil(items.length / 3);
    return [
      items.slice(0, itemsPerColumn),
      items.slice(itemsPerColumn, itemsPerColumn * 2),
      items.slice(itemsPerColumn * 2),
    ];
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/15 border-b border-white/20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Logo + Navigation links */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-semibold text-white hover:text-gray-200 transition">
                HS Architects
              </Link>
              <div className="flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  Home
                </Link>

                {/* Projects Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredItem("projects")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href="/projects"
                    className="text-white hover:text-gray-200 transition-colors flex items-center relative"
                  >
                    Projects
                    {hoveredItem === "projects" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                    )}
                  </Link>
                </div>

                {/* About Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredItem("about")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href="/about"
                    className="text-white hover:text-gray-200 transition-colors flex items-center relative"
                  >
                    About
                    {hoveredItem === "about" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                    )}
                  </Link>
                </div>

                {/* Contact Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredItem("contact")}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Link
                    href="/contact"
                    className="text-white hover:text-gray-200 transition-colors flex items-center relative"
                  >
                    Contact
                    {hoveredItem === "contact" && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>
                    )}
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side: Language + Search */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select className="text-white bg-white/10 border border-white/30 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer backdrop-blur-sm">
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
              </select>

              {/* Search Icon */}
              <button
                className="text-white hover:text-gray-200 transition-colors p-2"
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      {hoveredItem && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-fade-in"
          onMouseEnter={() => setHoveredItem(hoveredItem)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="h-full w-full flex flex-col">
            {/* Close button */}
            <div className="flex justify-end p-6">
              <button
                onClick={() => setHoveredItem(null)}
                className="text-white hover:text-gray-300 transition-colors p-2"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
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

            {/* Menu content */}
            <div className="flex-1 flex items-center justify-center px-8 pb-20">
              <div className="max-w-6xl w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {getColumns(menuItems[hoveredItem]).map((column, colIndex) => (
                    <div key={colIndex} className="space-y-4">
                      {column.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setHoveredItem(null)}
                          className="block text-white text-lg hover:text-gray-300 transition-colors py-2 animate-slide-in-up"
                          style={{
                            animationDelay: `${index * 0.05}s`,
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
