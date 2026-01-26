"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryClient";

export default function ProjectsPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleElements, setVisibleElements] = useState({});
  const [layoutType, setLayoutType] = useState("list");
  const introRef = useRef(null);
  const categoryRefs = useRef([]);

  useEffect(() => {
    fetchLayoutSetting();
    fetchCategories();
  }, []);

  const fetchLayoutSetting = async () => {
    try {
      const response = await fetch("/api/settings?key=projectsLayout");
      const data = await response.json();
      if (data.value) {
        setLayoutType(data.value);
      }
    } catch (error) {
      console.error("Error fetching layout setting:", error);
    }
  };

  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "50px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id) {
            setVisibleElements((prev) => ({ ...prev, [id]: true }));
          }
        }
      });
    }, observerOptions);

    // Observe intro section
    if (introRef.current) {
      observer.observe(introRef.current);
    }

    // Observe category blocks
    categoryRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (introRef.current) observer.unobserve(introRef.current);
      categoryRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [loading, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      // Show all categories
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  // Get images from category data or use placeholders
  const getCategoryImages = (category) => {
    if (category.gridImages && Array.isArray(category.gridImages) && category.gridImages.length > 0) {
      // Filter out empty strings and ensure we have valid images
      const validImages = category.gridImages.filter(img => img && img.trim() !== "");
      if (validImages.length > 0) {
        // Pad to 9 images if needed
        const paddedImages = [...validImages];
        while (paddedImages.length < 9) {
          paddedImages.push(paddedImages[paddedImages.length % validImages.length] || "/home.png");
        }
        return paddedImages.slice(0, 9);
      }
    }
    // Fallback to grey placeholder squares (empty strings will render as light grey)
    return Array(9).fill("");
  };

  // Helper function to get image source (Cloudinary or fallback)
  const getImageSrc = (imagePath) => {
    // Check if it's a Cloudinary public ID (no leading slash) or local path
    if (!imagePath) return null;
    if (imagePath.startsWith('/') || imagePath.startsWith('http')) {
      return imagePath; // Local path or full URL
    }
    // Use Cloudinary with optimized settings for grid images
    return getCloudinaryImageUrl(imagePath, {
      width: 800,
      height: 800,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  };

  // Get category content from the category data itself
  const getCategoryContent = (category) => {
    return {
      title: `PROJECT — ${category.name.toUpperCase()}`,
      description: category.description || "",
    };
  };

  // List Layout (Current UI - Completed)
  const renderListLayout = () => (
    <>
      {/* Intro Section */}
      <section
        ref={introRef}
        data-id="intro"
        className="bg-white pt-24 pb-12 sm:pt-32 sm:pb-16"
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            visibleElements.intro
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="uppercase tracking-[0.2em] text-2xl sm:text-3xl lg:text-4xl font-medium text-black">
            PROJECTS
          </h1>
        </div>
      </section>

      {/* Category Blocks */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        <div>
          {categories.map((category, index) => {
            const content = getCategoryContent(category);
            const images = getCategoryImages(category);
            const categoryId = `category-${category.id}`;
            const isVisible = visibleElements[categoryId] ?? true;

            return (
              <div
                key={category.id}
                ref={(el) => (categoryRefs.current[index] = el)}
                data-id={categoryId}
              >
                <Link
                  href={`/projects/${category.slug}`}
                  className="block group transition-opacity duration-300 hover:opacity-95"
                >
                  <div className="flex flex-col lg:flex-row items-stretch">
                    {/* Left: 3x3 Image Grid */}
                    <div
                      className={`w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 transition-all duration-1000 flex items-center justify-center ${
                        isVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-8"
                      }`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      <div className="grid grid-cols-3 gap-1 sm:gap-2 aspect-square w-full max-w-xs lg:max-w-sm">
                        {images.map((imagePath, imgIndex) => {
                          const hasImage = imagePath && imagePath.trim() !== "";
                          const imageSrc = hasImage ? getImageSrc(imagePath) : null;
                          return (
                            <div
                              key={imgIndex}
                              className="relative aspect-square overflow-hidden group/image"
                            >
                              {hasImage && imageSrc ? (
                                <Image
                                  src={imageSrc}
                                  alt={`${category.name} project ${imgIndex + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                                  sizes="(max-width: 1024px) 33vw, 16vw"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#fafafa] border border-gray-200/50" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Text */}
                    <div className="w-full lg:w-1/2 flex items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-0">
                      <div
                        className={`w-full max-w-lg space-y-6 transition-all duration-1000 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 translate-x-8"
                        }`}
                        style={{ transitionDelay: `${index * 150 + 100}ms` }}
                      >
                        {/* Category Title - Consistent font */}
                        <h2
                          className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-medium transition-colors duration-300 group-hover:text-gray-900"
                          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                        >
                          {content.title}
                        </h2>

                        {/* Description - Clean sans-serif */}
                        <p
                          className="text-base sm:text-lg leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-800"
                          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                        >
                          {content.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // Get the first valid image from category for grid view
  const getCategoryImage = (category) => {
    if (category.gridImages && Array.isArray(category.gridImages) && category.gridImages.length > 0) {
      const validImage = category.gridImages.find(img => img && img.trim() !== "");
      if (validImage) {
        return getImageSrc(validImage);
      }
    }
    if (category.image && category.image.trim() !== "") {
      return getImageSrc(category.image);
    }
    return null;
  };

  // Grid Layout (Second UI - Square Cards with Hover)
  const renderGridLayout = () => (
    <>
      {/* Intro Section */}
      <section className="bg-white pt-24 pb-8 sm:pt-32 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="uppercase tracking-[0.2em] text-2xl sm:text-3xl lg:text-4xl font-medium text-black">
            PROJECTS
          </h1>
        </div>
      </section>

      {/* Grid of Categories */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500">No categories found.</p>
        </div>
      ) : (
        <section className="pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-1.5">
              {categories.map((category) => {
                const imageSrc = getCategoryImage(category);
                
                return (
                  <Link
                    key={category.id}
                    href={`/projects/${category.slug}`}
                    className="group relative aspect-square overflow-hidden bg-gray-100"
                  >
                    {/* Background Image */}
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}

                    {/* Dark Overlay - appears on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 ease-out" />

                    {/* Category Name - appears on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <h2 
                          className="text-white text-lg sm:text-xl lg:text-2xl font-medium tracking-wide uppercase"
                          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                        >
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-white/80 text-xs sm:text-sm mt-2 max-w-[200px] mx-auto line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Optional: Small label at top (like "BUILT" in reference) */}
                    {/* 
                    <div className="absolute top-4 left-0 right-0 text-center">
                      <span className="text-white text-xs tracking-[0.2em] uppercase opacity-80">
                        {category.name}
                      </span>
                    </div>
                    */}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {layoutType === "list" ? renderListLayout() : renderGridLayout()}
      </main>
    </>
  );
}


