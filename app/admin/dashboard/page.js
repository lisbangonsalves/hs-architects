"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check authentication
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/admin");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-label="Open menu"
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
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Projects
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                24
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Projects
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                12
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                12
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      New project added
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Residential Complex - Downtown
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    2 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Project updated
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Office Building - Main Street
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    5 hours ago
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Client meeting scheduled
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Commercial Plaza Project
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    1 day ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
}
