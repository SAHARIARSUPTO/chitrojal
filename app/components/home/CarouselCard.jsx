"use client";

import React from "react";
import Image from "next/image";

/**
 * A reusable card component that displays a static image as a cover.
 * When clicked, it triggers the onClick handler.
 *
 * @param {{
 *   images: string[];
 *   title: string;
 *   subtitle: string;
 *   className?: string;
 *   textClassName?: string;
 *   titleClassName?: string;
 *   subtitleClassName?: string;
 *   onClick: () => void;
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
  onClick,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl group cursor-pointer bg-black ${className}`}
      onClick={handleCardClick}
    >
      {images && images.length > 0 && (
        <Image
          src={images[0]}
          alt={`${title} - cover image`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      )}
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
