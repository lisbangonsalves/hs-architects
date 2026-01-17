"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  // Get user role and name from localStorage
  useEffect(() => {
    const role = localStorage.getItem("adminRole");
    const name = localStorage.getItem("adminName");
    // If no role is stored but user is authenticated, assume admin (backward compatibility)
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (isAuthenticated && !role) {
      // Set default role for users logged in before role system
      localStorage.setItem("adminRole", "admin");
      setUserRole("admin");
    } else {
      setUserRole(role);
    }
    setUserName(name || "Admin");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminName");
    router.push("/admin");
  };

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Home page", href: "/admin/home" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Studio", href: "/admin/studio" },
    { label: "Contact", href: "/admin/contact" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Manage Users", href: "/admin/users", adminOnly: true },
  ];

  // Filter menu items based on role (null/undefined treated as admin for backward compatibility)
  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || userRole === "admin" || userRole === null
  );

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
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between lg:block">
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
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 sm:px-6 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
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

          {/* Logout Section */}
          <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userRole || "Admin"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
