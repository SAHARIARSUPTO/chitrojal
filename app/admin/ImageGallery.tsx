"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ImageGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const showNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const showPrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isViewerOpen) return;
      if (e.key === "ArrowRight") {
        showNextImage();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "Escape") {
        closeImageViewer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isViewerOpen, showNextImage, showPrevImage]);

  return (
    <div className="relative z-10">
      <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer group"
            onClick={() => openImageViewer(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={300}
              className="rounded-lg object-cover aspect-square group-hover:opacity-75 transition-opacity"
            />
          </div>
        ))}
      </div>

      {isViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
          <Image
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
            layout="fill"
            objectFit="contain"
            className="p-8"
          />
          <button
            onClick={closeImageViewer}
            className="absolute top-5 right-5 text-white text-3xl hover:text-orange-400 transition-colors"
          >
            <FiX />
          </button>
          <button
            onClick={showPrevImage}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={showNextImage}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/30 p-2 rounded-full hover:bg-black/50 transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
