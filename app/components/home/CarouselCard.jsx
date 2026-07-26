"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

/**
 * A reusable card component that displays an auto-sliding carousel of images.
 *
 * @param {{
 *   images: string[];
 *   title: string;
 *   subtitle: string;
 *   className?: string;
 *   textClassName?: string;
 *   titleClassName?: string;
 *   subtitleClassName?: string;
 *   autoSlide?: boolean;
 * }} props
 */
const CarouselCard = ({
  images,
  title,
  subtitle,
  className = "",
  textClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  autoSlide = true,
  onClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [autoSlide, images.length]);

  const handleCardClick = () => {
    if (onClick) {
      onClick(currentIndex);
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl group cursor-pointer bg-black ${className}`}
      onClick={handleCardClick}
    >
      <div
        className="absolute inset-0 w-full h-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={src}
              alt={`${title} - image ${index + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      <div className={`absolute bottom-0 left-0 p-6 md:p-8 ${textClassName}`}>
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-bold text-orange-400 font-poppins uppercase ${titleClassName}`}
        >
          {title}
        </h2>
        <p className={`mt-1 text-xs text-gray-200 ${subtitleClassName}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CarouselCard;
