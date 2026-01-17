"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import { getCloudinaryImageUrl } from "../../../lib/cloudinaryClient";

export default function AdminHome() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [gridImages, setGridImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    } else {
      fetchGridImages();
    }
  }, [router]);

  const fetchGridImages = async () => {
    try {
      const response = await fetch("/api/home-grid");
      const data = await response.json();
      
      // Ensure we always have 9 slots
      const gridSlots = Array.from({ length: 9 }, (_, index) => {
        const existing = data.find((item) => item.position === index + 1);
        return existing || {
          id: `temp-${index}`,
          position: index + 1,
          image: "",
          cloudinaryPublicId: null,
        };
      });
      
      setGridImages(gridSlots);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching grid images:", error);
      // Fallback: create 9 empty slots
      const emptySlots = Array.from({ length: 9 }, (_, index) => ({
        id: `temp-${index}`,
        position: index + 1,
        image: "",
        cloudinaryPublicId: null,
      }));
      setGridImages(emptySlots);
      setLoading(false);
    }
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    setUploading({ ...uploading, [index]: true });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/cloudinary/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();

      const currentImage = gridImages[index];
      
      // Update or create the grid image
      const updateResponse = await fetch("/api/home-grid", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: currentImage.id,
          position: index + 1,
          cloudinaryPublicId: uploadData.publicId,
          image: uploadData.url,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to save image");
      }

      await fetchGridImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading({ ...uploading, [index]: false });
      setEditingIndex(null);
    }
  };

  const getImageSrc = (image) => {
    if (image.cloudinaryPublicId) {
      return getCloudinaryImageUrl(image.cloudinaryPublicId, {
        width: 800,
        height: 800,
        crop: "fill",
        quality: "auto",
        format: "auto",
      });
    }
    return image.image;
  };

  if (!mounted || loading) {
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
                  Home Page
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-3 sm:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-x-hidden">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-4">
                Manage Home Page Grid
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                Upload and manage the 9 images displayed in the home page grid.
              </p>
            </div>

            {/* Grid Preview and Management */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Grid Images (3x3)
              </h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 w-full max-w-full lg:max-w-2xl mx-auto">
                {gridImages.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden group touch-manipulation bg-gray-50 dark:bg-gray-700"
                  >
                    {image.image && (
                      <Image
                        src={getImageSrc(image)}
                        alt={`Grid image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 200px, 250px"
                      />
                    )}
                    {!image.image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Click to upload
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <label className="cursor-pointer opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(index, file);
                            }
                          }}
                          disabled={uploading[index]}
                        />
                        <div className="bg-white/90 text-gray-900 px-2 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-white active:bg-white transition-colors">
                          {uploading[index] ? "Uploading..." : image.image ? "Change" : "Upload"}
                        </div>
                      </label>
                    </div>
                    {uploading[index] && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <div className="text-white text-xs sm:text-sm">Uploading...</div>
                      </div>
                    )}
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-black/70 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded z-10">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
