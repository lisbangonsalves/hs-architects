"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/90 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p className="font-semibold text-white">HS Architects</p>
          <p className="text-gray-400 text-xs">
            Crafting thoughtful, human-centered spaces.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span>© {year} HS Architects. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <a href="/projects" className="hover:text-white transition-colors">
            Projects
          </a>
          <a href="/about" className="hover:text-white transition-colors">
            About
          </a>
          <a href="/contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}



