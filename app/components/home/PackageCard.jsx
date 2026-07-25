"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

// Helper function to convert English digits to Bengali
const toBengaliNumber = (num) => {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num?.toString().replace(/\d/g, (digit) => bengaliDigits[digit]);
};

// Default sample package data inside the file to prevent undefined errors
const defaultPackages = [
  {
    id: 1,
    name: "বেসিক প্ল্যান",
    price: "৯৯৯",
    duration: "মাসিক",
    features: [
      "এসডি কোয়ালিটি স্ট্রিম",
      "১টি ডিভাইসে ব্যবহার",
      "লিমিটেড ডাউনলোড সুবিধা",
      "ইমেইল সাপোর্ট",
    ],
  },
  {
    id: 2,
    name: "স্ট্যান্ডার্ড প্ল্যান",
    price: "১৪৯৯",
    duration: "মাসিক",
    features: [
      "এইচডি কোয়ালিটি স্ট্রিম",
      "২টি ডিভাইসে একসাথ ব্যবহার",
      "আনলিমিটেড ডাউনলোড",
      "২৪/৭ কাস্টমার সাপোর্ট",
    ],
  },
  {
    id: 3,
    name: "প্রিমিয়াম প্ল্যান",
    price: "২৪৯৯",
    duration: "মাসিক",
    features: [
      "৪কে আল্ট্রা এইচডি স্ট্রিম",
      "৪টি ডিভাইসে একসাথ ব্যবহার",
      "আনলিমিটেড ডাউনলোড",
      "ভিআইপি কাস্টমার সাপোর্ট",
      "বিজ্ঞাপন মুক্ত অভিজ্ঞতা",
    ],
  },
];

const PackageCard = ({ packages = defaultPackages }) => {
  // Renamed from PackageSlider to PackageCard
  // Safe array fallback
  const packageList = packages.length > 0 ? packages : defaultPackages;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? packageList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === packageList.length - 1 ? 0 : prev + 1));
  };

  const currentPackage = packageList[currentIndex];

  return (
    <div className="relative w-full h-full">
      {/* Slider Container */}
      <div className="relative w-full h-full flex flex-col justify-between rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-6">
        {/* Content */}
        <div className="relative z-10 flex flex-col flex-grow">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />

          {/* Static Title */}
          <h2 className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-2">
            Photographic Packages
          </h2>

          {/* Package Name */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-wide">
            {currentPackage?.name}
          </h3>

          {/* Price Section */}
          <div className="mt-3 mb-4 flex items-baseline gap-1">
            <span className="text-xl font-bold text-orange-400">৳</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
              {toBengaliNumber(currentPackage?.price)}
            </span>
            {currentPackage?.duration && (
              <span className="text-xs text-slate-400 font-medium ml-1">
                / {currentPackage.duration}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-slate-800 mb-4" />

          {/* Features List */}
          <ul className="space-y-2 flex-grow">
            {(currentPackage?.features || []).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2
                  size={18}
                  className="text-orange-400 shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-slate-300 text-xs sm:text-sm leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* Bottom section with button and pagination */}
          <div className="relative z-10 mt-4">
            {/* Call to Action Button */}
            <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-base py-3 rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 active:scale-[0.98]">
              প্যাকেজটি বেছে নিন
            </button>
            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-2 mt-4">
              {packageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx
                      ? "w-6 bg-orange-500"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800/90 text-white hover:bg-orange-500 border border-slate-700 shadow-xl transition-all duration-300 active:scale-90"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Floating Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-800/90 text-white hover:bg-orange-500 border border-slate-700 shadow-xl transition-all duration-300 active:scale-90"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default PackageCard;
