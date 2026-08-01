"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

/**
 * A reusable card component that displays a carousel of images or a static one.
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
 *   imageClassName?: string;
 *   onClick: () => void;
 *   autoScroll?: boolean;
 *   intervalDuration?: number;
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
  imageClassName = "object-cover object-top",
  onClick,
  autoScroll = true,
  intervalDuration = 3500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [JSON.stringify(images)]);

  useEffect(() => {
    if (autoScroll && images && images.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, intervalDuration);

      return () => clearInterval(interval);
    }
  }, [autoScroll, images, isHovered, intervalDuration]);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const isContain = imageClassName.includes("object-contain");

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-3xl group cursor-pointer bg-black ${className}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images && images.length > 0 ? (
        images.map((src, index) => (
          <React.Fragment key={src}>
            {isContain && (
              <Image
                src={src}
                alt=""
                fill
                className={`object-cover blur-2xl opacity-40 scale-110 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-40 z-0" : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden="true"
              />
            )}
            <Image
              src={src}
              alt={`${title} - image ${index + 1}`}
              fill
              className={`${imageClassName} transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              } group-hover:scale-[1.02] transition-transform duration-700`}
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
            />
          </React.Fragment>
        ))
      ) : (
        <div className="w-full h-full bg-gray-700" /> // Placeholder
      )}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className={`absolute bottom-0 left-0 z-30 p-6 md:p-8 ${textClassName}`}>
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
