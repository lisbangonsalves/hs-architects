"use client";

import Navbar from "../../components/Navbar";
import Image from "next/image";
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
                    className="w-full lg:w-[45%] p-4 sm:p-6 lg:p-8 flex items-center justify-center relative z-0"
                  >
                    <div className="w-full max-w-xs lg:max-w-sm relative">
                      <div 
                        ref={(el) => {
                          if (el) gridRefs.current[projectId] = el;
                        }}
                        className="grid grid-cols-3 gap-1 sm:gap-2 aspect-square w-full relative"
                      >
                        {project.images.map((imagePath, imageIndex) => {
                          const imageId = `${projectId}-${imageIndex}`;
                          const isActive = activeImageId === imageId;
                          const imageSrc = getImageSrc(imagePath);

                          return (
                            <div
                              key={imageIndex}
                              className="relative aspect-square overflow-hidden"
                            >
                              {!isActive && (
                                <motion.div
                                  layoutId={imageId}
                                  className="relative w-full h-full cursor-pointer z-0"
                                  onClick={() => handleImageClick(projectId, imageIndex)}
                                  onKeyDown={(e) => handleImageKeyDown(e, projectId, imageIndex)}
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`Expand image ${imageIndex + 1} of ${project.title}`}
                                  whileHover={{ opacity: 0.8 }}
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
                              )}
                              {isActive && (
                                <div className="w-full h-full bg-white" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expanded Image Overlay - Positioned absolutely within grid */}
                    <AnimatePresence>
                      {isExpanded && activeImageId?.startsWith(`${projectId}-`) && (
                        <motion.div
                          key={activeImageId}
                          layoutId={activeImageId}
                          className="absolute z-50 pointer-events-none"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: gridRefs.current[projectId]?.offsetWidth || '100%',
                            height: gridRefs.current[projectId]?.offsetHeight || '100%',
                            maxWidth: '28rem',
                            maxHeight: '28rem',
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            ease: [0.4, 0, 0.2, 1],
                            layout: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
                          }}
                        >
                          <div 
                            className="relative w-full h-full cursor-pointer group pointer-events-auto"
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
                            <Image
                              src={getImageSrc(
                                project.images[
                                  parseInt(activeImageId.split("-")[1])
                                ]
                              )}
                              alt={`${project.title} - Expanded view`}
                              fill
                              className="object-contain pointer-events-none group-hover:opacity-95 transition-opacity duration-200"
                              sizes="(max-width: 1024px) 100vw, 45vw"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Middle: White Space Lane - Always visible */}
                  <div className="w-full lg:w-[30%] bg-white flex items-center justify-center relative p-4 sm:p-6 lg:p-8 min-h-[300px] lg:min-h-0 z-0">
                    {/* Empty white space - reserved for future use */}
                  </div>

                  {/* Right: Text Column */}
                  <div className="w-full lg:w-[25%] flex items-center px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-0">
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
