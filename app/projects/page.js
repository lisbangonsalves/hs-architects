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
  const introRef = useRef(null);
  const categoryRefs = useRef([]);

  useEffect(() => {
    fetchCategories();
  }, []);

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
      // Filter to only show Architecture and Interior Design
      const filtered = data.filter(
        (cat) => cat.name === "Architecture" || cat.name === "Interior Design"
      );
      setCategories(filtered);
      setLoading(false);
      
      // If no categories found, show a fallback message
      if (filtered.length === 0) {
        console.warn("No categories found. Make sure categories.json has Architecture and Interior Design categories.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  // Placeholder images for the 3x3 grid - using local images as placeholders
  const categoryImages = {
    Architecture: [
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
    ],
    "Interior Design": [
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
      "/home.png",
      "/home2.png",
    ],
  };

  // Helper function to get image source (Cloudinary or fallback)
  const getImageSrc = (imagePath) => {
    // Check if it's a Cloudinary public ID (no leading slash) or local path
    if (imagePath.startsWith('/')) {
      return imagePath; // Local path
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

  const categoryContent = {
    Architecture: {
      title: "PROJECT — ARCHITECTURE",
      description:
        "Projects grounded in simplicity and shaped by site, light, and material—ranging from holiday homes and residences to commercial and institutional work.",
    },
    "Interior Design": {
      title: "PROJECT — INTERIOR",
      description:
        "Interior spaces crafted with restraint and clarity—homes, workspaces, hospitality, and wellness environments shaped around everyday experience.",
    },
  };

  return (
    <>
      <Navbar />
      <main className="bg-white">
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
              const content = categoryContent[category.name];
              if (!content) return null;

              const images = categoryImages[category.name] || [];
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
                            const imageSrc = getImageSrc(imagePath);
                            return (
                              <div
                                key={imgIndex}
                                className="relative aspect-square overflow-hidden group/image"
                              >
                                <Image
                                  src={imageSrc}
                                  alt={`${category.name} project ${imgIndex + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover/image:scale-110"
                                  sizes="(max-width: 1024px) 33vw, 16vw"
                                />
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
      </main>
    </>
  );
}


