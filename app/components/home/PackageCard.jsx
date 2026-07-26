"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PackageCard = ({ packageImages = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? packageImages.length - 1 : prev - 1,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === packageImages.length - 1 ? 0 : prev + 1,
    );
  };

  if (packageImages.length === 0) {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Packages Coming Soon
        </h3>
        <p className="text-slate-400">
          New and exciting packages will be available shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      {/* Image Slider Container */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-black">
        {packageImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Package image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Floating Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-orange-500/80 border border-white/10 shadow-xl transition-all duration-300 active:scale-90"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Floating Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-orange-500/80 border border-white/10 shadow-xl transition-all duration-300 active:scale-90"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center items-center gap-2">
        {packageImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "w-6 bg-orange-500" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PackageCard;
