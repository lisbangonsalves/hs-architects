"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { getCloudinaryImageUrl } from "../../../../lib/cloudinaryClient";

export default function AdminCategories() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    gridImages: Array(9).fill(""),
  });
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    } else {
      fetchCategories();
    }
  }, [router]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update
        const response = await fetch("/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...formData }),
        });
        if (response.ok) {
          fetchCategories();
          resetForm();
        }
      } else {
        // Create
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          fetchCategories();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    // Ensure gridImages is always an array of 9 items
    let gridImages = Array(9).fill("");
    if (category.gridImages && Array.isArray(category.gridImages) && category.gridImages.length > 0) {
      gridImages = [...category.gridImages];
      // Pad or trim to exactly 9 items
      while (gridImages.length < 9) {
        gridImages.push("");
      }
      gridImages = gridImages.slice(0, 9);
    }
    
    setFormData({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      gridImages: gridImages,
    });
  };

  const handleGridImageUpload = async (index, file) => {
    if (!file) return;

    setUploading({ ...uploading, [index]: true });

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const uploadResponse = await fetch("/api/cloudinary/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const uploadData = await uploadResponse.json();

      // Update the gridImages array - store the full URL for reliable display
      const currentGridImages = Array.isArray(formData.gridImages) 
        ? formData.gridImages 
        : Array(9).fill("");
      const newGridImages = [...currentGridImages];
      // Store the URL directly (more reliable than generating from publicId)
      newGridImages[index] = uploadData.url || "";
      setFormData({ 
        name: formData.name || "",
        slug: formData.slug || "",
        description: formData.description || "",
        image: formData.image || "",
        gridImages: newGridImages 
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading({ ...uploading, [index]: false });
    }
  };

  const getImageSrc = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return it directly
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Otherwise, generate Cloudinary URL from publicId
    return getCloudinaryImageUrl(imagePath, {
      width: 300,
      height: 300,
      crop: "fill",
      quality: "auto",
      format: "auto",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormData({ 
      name: "", 
      slug: "", 
      description: "", 
      image: "",
      gridImages: Array(9).fill(""),
    });
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
                <Link
                  href="/admin/projects"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ← Back
                </Link>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  Manage Categories
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="architecture"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                {/* Grid Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Category Grid Images (3x3)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Upload 9 images to display in the category grid on the projects page
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md">
                    {(Array.isArray(formData.gridImages) ? formData.gridImages : Array(9).fill("")).map((publicId, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden group bg-gray-50 dark:bg-gray-700"
                      >
                        {publicId && getImageSrc(publicId) && (
                          <Image
                            src={getImageSrc(publicId)}
                            alt={`Grid image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 33vw, 150px"
                          />
                        )}
                        {!publicId && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <svg
                                className="w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-1"
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
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Upload
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
                                  handleGridImageUpload(index, file);
                                }
                              }}
                              disabled={uploading[index]}
                            />
                            <div className="bg-white/90 text-gray-900 px-2 py-1 rounded text-xs font-medium hover:bg-white active:bg-white transition-colors">
                              {uploading[index] ? "..." : publicId ? "Change" : "Upload"}
                            </div>
                          </label>
                        </div>
                        {uploading[index] && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <div className="text-white text-xs">Uploading...</div>
                          </div>
                        )}
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded z-10">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                  >
                    {editingCategory ? "Update" : "Create"}
                  </button>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Existing Categories
              </h2>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        Delete
                      </button>
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
