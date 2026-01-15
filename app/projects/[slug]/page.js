"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getCloudinaryImageUrl } from "../../../lib/cloudinaryClient";

export default function CategoryProjectsPage() {
  const params = useParams();
  const slug = params?.slug;
  const [activeImageId, setActiveImageId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryRefs = useRef([]);
  const gridRefs = useRef({});
  const [gridHeights, setGridHeights] = useState({});

  // Placeholder projects data
  const placeholderProjects = [
    {
      id: "1",
      title: "Residential Complex",
      location: "Mumbai, India",
      year: "2024",
      description: "A modern residential development that responds to its urban context with clean lines and thoughtful materiality.",
      images: [
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
    },
    {
      id: "2",
      title: "Office Building",
      location: "Alibaug, India",
      year: "2023",
      description: "A workspace designed around natural light and open collaboration, with restrained material choices.",
      images: [
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
    },
    {
      id: "3",
      title: "Holiday Home",
      location: "Goa, India",
      year: "2023",
      description: "A retreat that opens to the landscape, using local materials and passive design strategies.",
      images: [
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
    },
  ];

  useEffect(() => {
    // Simulate fetching projects - replace with actual API call later
    setTimeout(() => {
      setProjects(placeholderProjects);
      setLoading(false);
    }, 500);
  }, [slug]);

  useEffect(() => {
    // Update grid heights when projects are loaded or window resizes
    const updateGridHeights = () => {
      const heights = {};
      Object.keys(gridRefs.current).forEach((projectId) => {
        const gridEl = gridRefs.current[projectId];
        if (gridEl) {
          heights[projectId] = gridEl.offsetHeight;
        }
      });
      setGridHeights(heights);
    };

    if (!loading) {
      updateGridHeights();
      window.addEventListener('resize', updateGridHeights);
      return () => window.removeEventListener('resize', updateGridHeights);
    }
  }, [loading, projects]);

  useEffect(() => {
    // Keyboard accessibility
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeImageId) {
        setActiveImageId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageId]);

  const handleImageClick = (projectId, imageIndex) => {
    const imageId = `${projectId}-${imageIndex}`;
    if (activeImageId === imageId) {
      setActiveImageId(null);
    } else {
      setActiveImageId(imageId);
    }
  };

  const handleImageKeyDown = (e, projectId, imageIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick(projectId, imageIndex);
    }
  };

  const getImageSrc = (imagePath) => {
    if (imagePath?.startsWith("/")) {
      return imagePath;
    }
    if (imagePath?.cloudinaryPublicId) {
      return getCloudinaryImageUrl(imagePath.cloudinaryPublicId, {
        width: 800,
        height: 800,
        crop: "fill",
        quality: "auto",
        format: "auto",
      });
    }
    return imagePath || "/home.png";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Header */}
        <section className="bg-white pt-24 pb-12 sm:pt-32 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Projects
            </Link>
            
            <h1 className="uppercase tracking-[0.2em] text-2xl sm:text-3xl lg:text-4xl font-medium text-black">
              {slug === "architecture" ? "ARCHITECTURE" : slug === "interior-design" ? "INTERIOR DESIGN" : "PROJECTS"}
            </h1>
          </div>
        </section>

        {/* Projects List */}
        <div>
          {projects.map((project, projectIndex) => {
            const projectId = project.id;
            const isExpanded = activeImageId?.startsWith(`${projectId}-`);

            return (
              <div
                key={project.id}
                ref={(el) => (categoryRefs.current[projectIndex] = el)}
                className="border-t border-gray-200 first:border-t-0"
              >
                <div className="flex flex-col lg:flex-row items-stretch relative">
                  {/* Left: 3x3 Grid */}
                  <div 
                    id={`grid-container-${projectId}`}
                    className="w-full lg:w-[45%] p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-0 overflow-hidden lg:overflow-visible"
                  >
                    <div 
                      className="w-full max-w-xs sm:max-w-sm relative overflow-hidden lg:overflow-visible"
                      ref={(el) => {
                        if (el) gridRefs.current[projectId] = el;
                      }}
                    >
                      <div className="grid grid-cols-3 gap-1 sm:gap-2 aspect-square w-full relative">
                        {project.images.map((imagePath, imageIndex) => {
                          const imageId = `${projectId}-${imageIndex}`;
                          const isActive = activeImageId === imageId;
                          const imageSrc = getImageSrc(imagePath);

                          return (
                            <div
                              key={imageIndex}
                              className="relative aspect-square overflow-hidden"
                            >
                              <motion.div
                                layoutId={imageId}
                                className={`relative w-full h-full cursor-pointer z-0 ${isActive ? 'opacity-0' : 'opacity-100'}`}
                                onClick={() => handleImageClick(projectId, imageIndex)}
                                onKeyDown={(e) => handleImageKeyDown(e, projectId, imageIndex)}
                                tabIndex={0}
                                role="button"
                                aria-label={`Expand image ${imageIndex + 1} of ${project.title}`}
                                whileHover={!isActive ? { opacity: 0.8 } : {}}
                                transition={{ duration: 0.2 }}
                              >
                                <Image
                                  src={imageSrc}
                                  alt={`${project.title} - Image ${imageIndex + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 1024px) 33vw, 200px"
                                />
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded Image - Left aligned with grid, same height, extends right on desktop */}
                      <AnimatePresence>
                        {isExpanded && activeImageId?.startsWith(`${projectId}-`) && (
                          <motion.div
                            key={activeImageId}
                            layoutId={activeImageId}
                            className="absolute top-0 left-0 z-50 lg:h-auto bg-white lg:bg-transparent"
                            style={{ 
                              height: gridRefs.current[projectId]?.offsetWidth || '100%',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 0.5, 
                              ease: [0.4, 0, 0.2, 1],
                              layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                            }}
                            onClick={() => setActiveImageId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setActiveImageId(null);
                              }
                            }}
                            tabIndex={0}
                            role="button"
                            aria-label="Collapse image"
                          >
                            <img
                              src={getImageSrc(
                                project.images[
                                  parseInt(activeImageId.split("-")[1])
                                ]
                              )}
                              alt={`${project.title} - Expanded view`}
                              className="cursor-pointer hover:opacity-95 transition-opacity duration-200 max-w-[90vw] lg:max-w-none"
                              style={{ 
                                height: '100%', 
                                width: 'auto',
                                objectFit: 'contain',
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Middle: White Space Lane - Hidden on mobile, visible on desktop */}
                  <div className="hidden lg:flex w-full lg:w-[5%] bg-white items-center justify-center relative z-0">
                    {/* Empty white space - reserved for future use */}
                  </div>

                  {/* Right: Text Column */}
                  <div className="w-full lg:w-[50%] flex items-center px-4 sm:px-6 lg:px-8 py-6 lg:py-0">
                    <div className="w-full space-y-4">
                      <h2
                        className="text-xl sm:text-2xl lg:text-3xl text-gray-800 font-medium"
                        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                      >
                        {project.title}
                      </h2>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>{project.location}</p>
                        <p>{project.year}</p>
                      </div>
                      <p
                        className="text-sm sm:text-base leading-relaxed text-gray-700 mt-4"
                        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                      >
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
