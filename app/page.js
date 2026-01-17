"use client";

import Navbar from "./components/Navbar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getCloudinaryImageUrl } from "../lib/cloudinaryClient";

export default function Home() {
  const [gridImages, setGridImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGridImages();
  }, []);

  const fetchGridImages = async () => {
    try {
      const response = await fetch("/api/home-grid");
      const data = await response.json();
      
      // Ensure we always have 9 slots
      const gridSlots = Array.from({ length: 9 }, (_, index) => {
        const existing = data.find((item) => item.position === index + 1);
        return existing || {
          id: `empty-${index}`,
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
        id: `empty-${index}`,
        position: index + 1,
        image: "",
        cloudinaryPublicId: null,
      }));
      setGridImages(emptySlots);
      setLoading(false);
    }
  };

  const getImageSrc = (image) => {
    if (image?.cloudinaryPublicId) {
      return getCloudinaryImageUrl(image.cloudinaryPublicId, {
        width: 800,
        height: 800,
        crop: "fill",
        quality: "auto",
        format: "auto",
      });
    }
    return image?.image || "/home.png";
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center justify-center">
            {/* Centered 3x3 Grid - Smaller size */}
            {loading ? (
              <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full max-w-[280px] sm:max-w-sm lg:max-w-md aspect-square">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full max-w-[280px] sm:max-w-sm lg:max-w-md aspect-square">
                {gridImages.map((image, index) => {
                  const hasImage = image?.image && (image.image.trim() !== "" || image?.cloudinaryPublicId);
                  
                  return (
                    <div
                      key={image?.id || index}
                      className={`relative aspect-square overflow-hidden ${
                        hasImage ? "group cursor-pointer" : ""
                      }`}
                    >
                      {hasImage ? (
                        <>
                          <Image
                            src={getImageSrc(image)}
                            alt={`Portfolio image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 20vw, 15vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 ease-out" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-[#fafafa] border border-gray-200/50 dark:bg-gray-800" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
