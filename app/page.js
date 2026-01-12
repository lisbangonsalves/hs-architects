"use client";

import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const heroRef = useRef(null);
  const projectsRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    let lastScrollY = 0;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateProgress = () => {
      if (!heroRef.current || !projectsRef.current) return;

      const scrollY = window.scrollY;
      const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
      const projectsTop = projectsRef.current.offsetTop;
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when hero is fully visible, 1 when projects section is fully in view
      const transitionStart = heroBottom - viewportHeight * 0.8;
      const transitionEnd = projectsTop - viewportHeight * 0.2;
      const transitionRange = transitionEnd - transitionStart;

      let progress = 0;
      if (scrollY < transitionStart) {
        progress = 0;
      } else if (scrollY > transitionEnd) {
        progress = 1;
      } else {
        progress = (scrollY - transitionStart) / transitionRange;
        progress = Math.max(0, Math.min(1, progress));
        // Apply easing for smoother transition
        progress = easeOutCubic(progress);
      }

      setScrollProgress(progress);
      lastScrollY = scrollY;
    };

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Intersection Observer for projects animation
  useEffect(() => {
    if (!projectsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !projectsVisible) {
            setProjectsVisible(true);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the section is visible
        rootMargin: "0px",
      }
    );

    observer.observe(projectsRef.current);

    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, [projectsVisible]);

  // Hero image fades more gradually - stays visible longer
  const heroImageOpacity = Math.max(0, 1 - scrollProgress * 0.8);
  const heroTextOpacity = Math.max(0, 1 - scrollProgress * 1.0);
  // Bottom text fades with the image
  const bottomTextOpacity = Math.max(0, 1 - scrollProgress * 0.8);
  // Black gradient overlay fades in more gradually
  const blackOverlayOpacity = Math.min(1, scrollProgress * 0.9);
  // Projects section background appears more gradually as it approaches top
  const projectsBgOpacity = scrollProgress >= 0.7 ? Math.min(1, (scrollProgress - 0.7) / 0.3) : 0;

  // Projects slide up: gentle movement (max 10vh)
  const projectsTransform = `translateY(${(1 - scrollProgress) * 10}vh)`;
  const projectsOpacity = 1; // Always fully opaque

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero with layered composition */}
        <section
          ref={heroRef}
          className="relative min-h-screen bg-white overflow-hidden"
        >
          {/* Layer 1 – Base: Pure white background */}
          <div className="absolute inset-0 bg-white z-0" />
          
          {/* Black gradient overlay that fades in on scroll */}
          <div 
            className="fixed inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(0, 0, 0, ${blackOverlayOpacity * 0.3}), 
                rgba(0, 0, 0, ${blackOverlayOpacity * 0.7})
              )`,
              willChange: "background",
              zIndex: 15,
            }}
          />
          
          {/* Layer 2 – Text: Positioned top-right, independent layer */}
          <div 
            className="absolute top-0 right-0 z-10 pt-16 sm:pt-20 lg:pt-24 pr-4 sm:pr-8 lg:pr-12 xl:pr-20"
            style={{
              opacity: heroTextOpacity,
              willChange: "opacity",
            }}
          >
            <div className="w-[90vw] sm:w-[85vw] lg:w-[38vw] xl:w-[42vw] max-w-xl space-y-3 animate-slide-in-up-smooth">
              <p className="uppercase tracking-[0.3em] text-xs text-[#2a2a2a]">
                ARCHITECTURE + INTERIOR DESIGN
              </p>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl leading-tight text-[#1a1a1a]"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Architecture shaped by space, light, and restraint.
              </h1>
            </div>
          </div>

          {/* Layer 3 – Image: Fixed position, covers entire screen, fades on scroll */}
          <div 
            className="fixed inset-0 z-20 w-full h-full pointer-events-none"
            style={{
              opacity: heroImageOpacity,
              willChange: "opacity",
            }}
          >
            <Image
              src="/home.png"
              alt="HS Architects"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Layer 4 – Small text: Fixed position, center bottom, fades on scroll */}
          <div 
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 pb-8 sm:pb-12 lg:pb-16 pointer-events-none"
            style={{
              opacity: bottomTextOpacity,
              willChange: "opacity",
              zIndex: 25,
            }}
          >
            <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-lg px-6 py-4 sm:px-8 sm:py-5">
              <p
                className="text-sm sm:text-base leading-relaxed text-[#2a2a2a] text-center max-w-2xl"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                HS Architects is a multidisciplinary practice focused on creating
                spaces that respond to context, material, and human experience.
              </p>
            </div>
          </div>
        </section>

        {/* Selected Projects */}
        <section
          ref={projectsRef}
          className="bg-white text-gray-900 py-20 sm:py-32 relative -mt-[10vh] z-30"
          style={{
            transform: projectsTransform,
            willChange: "transform",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                {
                  name: "Harborview Residence",
                  label: "Architecture",
                  location: "Seattle, WA",
                  year: "2024",
                  image: "/projects/harborview.jpg",
                  href: "/projects/harborview",
                },
                {
                  name: "Crescent Innovation Hub",
                  label: "Architecture",
                  location: "Austin, TX",
                  year: "2023",
                  image: "/projects/crescent.jpg",
                  href: "/projects/crescent",
                },
                {
                  name: "Northline Cultural Center",
                  label: "Architecture",
                  location: "Chicago, IL",
                  year: "2023",
                  image: "/projects/northline.jpg",
                  href: "/projects/northline",
                },
                {
                  name: "Riverside Pavilion",
                  label: "Interior Design",
                  location: "Portland, OR",
                  year: "2024",
                  image: "/projects/riverside.jpg",
                  href: "/projects/riverside",
                },
              ].map((project, index) => (
                <a
                  key={project.name}
                  href={project.href}
                  className={`block transition-opacity hover:opacity-90 ${
                    projectsVisible ? "animate-fade-in-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: projectsVisible ? `${index * 0.15}s` : "0s",
                    animationFillMode: "both",
                  }}
                >
                  <div className="space-y-3">
                    {/* Project Image */}
                    <div className="w-full aspect-[4/3] bg-gray-800">
                      {/* Placeholder for project image - replace with actual image */}
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        {project.name}
                      </div>
                    </div>
                    
                    {/* Project Info */}
                    <div className="space-y-1">
                      <p className="uppercase tracking-[0.2em] text-xs text-gray-600">
                        {project.label}
                      </p>
                      <h3 className="text-base text-gray-900">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {project.location} / {project.year}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* We Believe Section */}
        <section className="bg-black py-32 sm:py-40 relative z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Text Content */}
            <div className="space-y-8 sm:space-y-10 mb-16 sm:mb-20">
              {/* Small Label */}
              <p className="uppercase tracking-[0.3em] text-xs text-gray-400">
                WE BELIEVE
              </p>
              
              {/* Main Statement */}
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#e8e3db]"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                We believe architecture is shaped
                by space, light, and human experience.
              </h2>
              
              {/* Supporting Paragraph */}
              <p
                className="text-base sm:text-lg lg:text-xl leading-relaxed text-[#e2ddce] max-w-3xl"
                style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
              >
                Each project is approached as a response to its context —
                stripped back to what is essential, so that what remains
                can be felt with clarity and purpose.
          </p>
        </div>
            
            {/* Image - Aligned to left with negative space */}
            <div className="w-full max-w-4xl">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/home2.png"
                  alt="HS Architects"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Practice Preview */}
        <section className="bg-white text-gray-900 py-20 sm:py-32 relative z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Text */}
              <div className="space-y-6">
                <h2
                  className="text-2xl sm:text-3xl"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  Our Practice
                </h2>
                <p className="text-lg sm:text-xl leading-relaxed text-gray-700">
                  Our approach is context-driven, responding thoughtfully to each
                  site's unique conditions and climate. We practice restraint in
                  design, allowing materials and light to speak clearly. Every
                  decision serves both function and the human experience of space.
                </p>
                <a
                  href="/practice"
                  className="inline-block text-gray-900 hover:opacity-70 transition-opacity text-sm tracking-wide"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  Learn more about our practice →
                </a>
              </div>

              {/* Right: Image */}
              <div className="w-full aspect-[4/3] bg-gray-200">
                {/* Placeholder for architectural image - replace with actual image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Practice Image
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
