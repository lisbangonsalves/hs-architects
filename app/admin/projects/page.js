"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function AdminProjects() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsLayout, setProjectsLayout] = useState("list");
  const [selectedLayout, setSelectedLayout] = useState("list");
  const [layoutLoading, setLayoutLoading] = useState(true);
  const [layoutSaving, setLayoutSaving] = useState(false);
  const [layoutSaved, setLayoutSaved] = useState(false);

  const layoutOptions = [
    { value: "list", label: "List View", description: "Categories with 3x3 image grids and descriptions" },
    { value: "grid", label: "Grid View", description: "Alternative grid-based layout (coming soon)" },
  ];

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    } else {
      fetchLayoutSetting();
    }
  }, [router]);

  const fetchLayoutSetting = async () => {
    try {
      const response = await fetch("/api/settings?key=projectsLayout");
      const data = await response.json();
      if (data.value) {
        setProjectsLayout(data.value);
        setSelectedLayout(data.value);
      }
    } catch (error) {
      console.error("Error fetching layout setting:", error);
    } finally {
      setLayoutLoading(false);
    }
  };

  const handleSaveLayout = async () => {
    setLayoutSaving(true);
    setLayoutSaved(false);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "projectsLayout", value: selectedLayout }),
      });
      if (response.ok) {
        setProjectsLayout(selectedLayout);
        setLayoutSaved(true);
        setTimeout(() => setLayoutSaved(false), 2000);
      }
    } catch (error) {
      console.error("Error saving layout setting:", error);
    } finally {
      setLayoutSaving(false);
    }
  };

  const hasLayoutChanges = selectedLayout !== projectsLayout;

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-0">
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
                  Projects Management
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Manage project categories and individual projects.
            </p>

            {/* Layout Selection Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Projects Page Layout
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose how projects are displayed on the public site
                  </p>
                </div>

                {layoutLoading ? (
                  <div className="space-y-3">
                    <div className="h-10 w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Dropdown Selector */}
                    <div className="max-w-xs">
                      <label htmlFor="layout-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Layout
                      </label>
                      <select
                        id="layout-select"
                        value={selectedLayout}
                        onChange={(e) => setSelectedLayout(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent cursor-pointer"
                      >
                        {layoutOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {/* Description of selected layout */}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {layoutOptions.find(opt => opt.value === selectedLayout)?.description}
                      </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveLayout}
                        disabled={layoutSaving || !hasLayoutChanges}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                          hasLayoutChanges
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        } ${layoutSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {layoutSaving ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      {layoutSaved && (
                        <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Saved!
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Current Status */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Currently active: <span className="font-medium text-gray-700 dark:text-gray-300">{layoutOptions.find(opt => opt.value === projectsLayout)?.label || projectsLayout}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Manage Categories Card */}
              <Link
                href="/admin/projects/categories"
                className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Manage Categories
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add, edit, or remove project categories and their grid images
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors flex-shrink-0 ml-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </Link>

              {/* Manage Projects Card */}
              <Link
                href="/admin/projects/manage"
                className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      Manage Projects
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Add, edit, or remove individual projects with images
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors flex-shrink-0 ml-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
