"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

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
      threshold: 0.2,
      rootMargin: "0px",
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
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
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
          className="bg-white pt-24 pb-20 sm:pt-32 sm:pb-24"
        >
          <div
            className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
              visibleElements.intro
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-6">
              PROJECTS
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8 text-gray-900"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              A curated collection of spaces shaped by context and craft.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 max-w-2xl">
              Our work spans diverse typologies, each project a thoughtful
              response to its environment, client aspirations, and the enduring
              principles of good design.
            </p>
          </div>
        </section>

        {/* Category Blocks */}
        {loading ? (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <div>
            {categories.map((category, index) => {
              const content = categoryContent[category.name];
              if (!content) return null;

              const categoryId = `category-${category.id}`;
              const isVisible = visibleElements[categoryId];

              return (
                <div
                  key={category.id}
                  ref={(el) => (categoryRefs.current[index] = el)}
                  data-id={categoryId}
                >
                  <Link
                    href={`/projects/${category.slug}`}
                    className="block group transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row items-stretch">
                      {/* Left: Image */}
                      <div
                        className={`w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto lg:h-[50vh] relative overflow-hidden transition-all duration-1000 ${
                          isVisible
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-8"
                        }`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                      >
                        <Image
                          src={category.image || "/home.png"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>

                      {/* Right: Text */}
                      <div className="w-full lg:w-1/2 flex items-center px-6 sm:px-8 lg:px-12 xl:px-16 py-12 lg:py-0">
                        <div
                          className={`max-w-lg space-y-6 transition-all duration-1000 ${
                            isVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 translate-x-8"
                          }`}
                          style={{ transitionDelay: `${index * 150 + 100}ms` }}
                        >
                          {/* Category Title */}
                          <h2
                            className="text-2xl sm:text-3xl lg:text-4xl text-gray-800 font-medium transition-colors duration-300 group-hover:text-gray-900"
                            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                          >
                            {content.title}
                          </h2>

                          {/* Description */}
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

                  {/* Divider (except after last item) */}
                  {index < categories.length - 1 && (
                    <div className="border-t border-gray-200"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}


