"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";
import { getCloudinaryImageUrl } from "../../../../lib/cloudinaryClient";

export default function AdminManageProjects() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [uploading, setUploading] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    label: "",
    location: "",
    year: "",
    image: "",
    title: "",
    description: "",
    images: Array(9).fill(""),
  });

  useEffect(() => {
    setMounted(true);
    const isAuthenticated = localStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      router.push("/admin");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/categories"),
      ]);
      const projectsData = await projectsRes.json();
      const categoriesData = await categoriesRes.json();
      setProjects(projectsData);
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use name as title if title is not provided
      // Filter out empty images
      const filteredImages = formData.images.filter(img => img && img.trim() !== "");
      
      const submitData = {
        ...formData,
        title: formData.title || formData.name,
        images: filteredImages,
        // Keep image field for backward compatibility (use first image)
        image: filteredImages[0] || formData.image || "",
      };

      if (editingProject) {
        // Update
        const response = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProject.id, ...submitData }),
        });
        if (response.ok) {
          fetchData();
          resetForm();
        }
      } else {
        // Create
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        });
        if (response.ok) {
          fetchData();
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    // Ensure images is always an array of 9 items
    let projectImages = Array(9).fill("");
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      projectImages = [...project.images];
      while (projectImages.length < 9) {
        projectImages.push("");
      }
      projectImages = projectImages.slice(0, 9);
    } else if (project.image) {
      // If only single image exists, put it in first slot
      projectImages[0] = project.image;
    }
    
    setFormData({
      name: project.name || "",
      categoryId: project.categoryId || "",
      label: project.label || "",
      location: project.location || "",
      year: project.year || "",
      image: project.image || "",
      title: project.title || project.name || "",
      description: project.description || "",
      images: projectImages,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
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

      // Update the images array
      const currentImages = Array.isArray(formData.images) 
        ? formData.images 
        : Array(9).fill("");
      const newImages = [...currentImages];
      newImages[index] = uploadData.url || "";
      
      setFormData({ 
        ...formData,
        images: newImages,
        // Also update the single image field for backward compatibility
        image: newImages[0] || formData.image,
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
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    // Otherwise, treat as Cloudinary public ID and generate URL
    return getCloudinaryImageUrl(imagePath, {
      width: 300,
      height: 300,
      crop: "fill",
      quality: "auto",
      format: "auto",
    });
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      categoryId: "",
      label: "",
      location: "",
      year: "",
      image: "",
      title: "",
      description: "",
      images: Array(9).fill(""),
    });
  };

  // Auto-set label based on selected category
  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    setFormData({
      ...formData,
      categoryId,
      label: category?.name || formData.label,
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
                  Manage Projects
                </h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            {/* Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Harborview Residence"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Display Title (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Leave empty to use Project Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Mumbai, India"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Brief description of the project..."
                  />
                </div>

                {/* Grid Images Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Project Grid Images (3x3)
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Upload 9 images to display in the project grid on the category page
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md">
                    {(Array.isArray(formData.images) ? formData.images : Array(9).fill("")).map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden group bg-gray-50 dark:bg-gray-700"
                      >
                        {imageUrl && getImageSrc(imageUrl) && (
                          <Image
                            src={getImageSrc(imageUrl)}
                            alt={`Grid image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 33vw, 150px"
                          />
                        )}
                        {!imageUrl && (
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
                              {uploading[index] ? "..." : imageUrl ? "Change" : "Upload"}
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

                {/* Hidden label field - auto-set from category */}
                <input type="hidden" value={formData.label} />

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                  >
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                  {editingProject && (
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

            {/* Projects List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Existing Projects ({projects.length})
              </h2>
              {projects.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No projects yet. Create your first project above.
                </p>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {projects.map((project) => {
                    const category = categories.find((c) => c.id === project.categoryId);
                    return (
                      <div
                        key={project.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-md gap-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* Thumbnail */}
                          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {project.image ? (
                              <Image
                                src={project.image}
                                alt={project.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {project.title || project.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {category?.name || "No category"} · {project.location} · {project.year}
                            </p>
                            {project.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
                                {project.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleEdit(project)}
                            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
