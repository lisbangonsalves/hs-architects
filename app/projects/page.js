"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ProjectsPage() {
  const [archVisible, setArchVisible] = useState(false);
  const [interiorVisible, setInteriorVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const archRef = useRef(null);
  const interiorRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  useEffect(() => {
    if (categories.length === 0) return;

    const observerOptions = {
      threshold: 0.3,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target === archRef.current) {
            setArchVisible(true);
          } else if (entry.target === interiorRef.current) {
            setInteriorVisible(true);
          }
        }
      });
    }, observerOptions);

    if (archRef.current) observer.observe(archRef.current);
    if (interiorRef.current && categories.length > 1) observer.observe(interiorRef.current);

    return () => {
      if (archRef.current) observer.unobserve(archRef.current);
      if (interiorRef.current) observer.unobserve(interiorRef.current);
    };
  }, [categories]);

  return (
    <>
      <Navbar />
      <main className="bg-[#101014] text-white">
        {/* SECTION 1 – Intro (Black) */}
        <section className="bg-[#101014] text-white pt-24 pb-20 sm:pt-32 sm:pb-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-6">
              PROJECTS
            </p>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight mb-8"
              style={{ fontFamily: "var(--font-serif), serif" }}
            >
              A curated collection of spaces shaped by context and craft.
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-gray-300 max-w-2xl">
              Our work spans diverse typologies, each project a thoughtful
              response to its environment, client aspirations, and the enduring
              principles of good design.
            </p>
          </div>
        </section>

        {/* Category Sections */}
        {loading ? (
          <div className="h-[60vh] flex items-center justify-center">
            <p className="text-gray-400">Loading categories...</p>
          </div>
        ) : (
          categories.map((category, index) => {
            const isFirst = index === 0;
            const categoryRef = isFirst ? archRef : (index === 1 ? interiorRef : null);
            const isVisible = isFirst ? archVisible : (index === 1 ? interiorVisible : true);
            
            return (
              <Link
                key={category.id}
                ref={categoryRef}
                href={`/projects/${category.slug}`}
                className="block w-full h-[60vh] sm:h-[70vh] relative group overflow-hidden"
              >
                <div className="absolute inset-0">
                  <Image
                    src={category.image || "/home.png"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="100vw"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:pl-12 lg:pl-20 z-10">
                  <div className={`px-4 sm:px-0 space-y-4 sm:space-y-6 max-w-2xl transition-all duration-1000 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}>
                    <p className="relative inline-block uppercase tracking-[0.3em] text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-white opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {category.name.toUpperCase()}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500 ease-out"></span>
                    </p>
                    <p
                      className="text-lg sm:text-xl lg:text-2xl leading-tight text-white transition-all duration-1000 delay-200"
                      style={{ 
                        fontFamily: "var(--font-serif), serif",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(20px)",
                      }}
                    >
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </main>
    </>
  );
}


