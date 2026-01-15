"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isAdmin = pathname?.startsWith("/admin");

  // Don't show footer on home page or admin pages
  if (isHome || isAdmin) {
    return null;
  }

  return <Footer />;
}
