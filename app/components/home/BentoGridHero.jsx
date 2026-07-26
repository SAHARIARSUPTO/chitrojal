"use client";

import React, { useState } from "react";
import CarouselCard from "./CarouselCard";
import PackageCard from "./PackageCard";
import FullscreenCarousel from "./FullscreenCarousel";

const BentoGridHero = ({ carouselData, packageImages }) => {
  const [fullscreen, setFullscreen] = useState({
    isOpen: false,
    images: [],
    startIndex: 0,
  });

  const openFullscreen = (images, startIndex) => {
    setFullscreen({ isOpen: true, images, startIndex });
  };

  const closeFullscreen = () => {
    setFullscreen({ isOpen: false, images: [], startIndex: 0 });
  };

  return (
    <>
      <section className="w-full bg-[#040404] p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col gap-4 md:gap-6 lg:gap-8">
            <div className="aspect-[3/4] md:aspect-[4/3]">
              <CarouselCard
                images={carouselData.portfolio.images}
                title={carouselData.portfolio.title}
                subtitle={carouselData.portfolio.subtitle}
                onClick={(startIndex) =>
                  openFullscreen(carouselData.portfolio.images, startIndex)
                }
                autoSlide={true}
              />
            </div>
            <div className="aspect-[3/4] md:aspect-[4/3] flex-grow">
              <CarouselCard
                images={carouselData.portraitLibrary.images}
                title={carouselData.portraitLibrary.title}
                subtitle={carouselData.portraitLibrary.subtitle}
                onClick={(startIndex) =>
                  openFullscreen(
                    carouselData.portraitLibrary.images,
                    startIndex,
                  )
                }
                autoSlide={false}
                textClassName="[writing-mode:vertical-rl] !left-auto !bottom-auto top-6 right-6 md:top-8 md:right-8 transform-none"
                titleClassName="tracking-[0.2em]"
                subtitleClassName="tracking-[0.2em]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 h-full flex flex-col gap-4 md:gap-6 lg:gap-8">
            <div className="aspect-square">
              <PackageCard packageImages={packageImages} />
            </div>
            <div className="aspect-[4/3]">
              <CarouselCard
                images={carouselData.landscapeLibrary.images}
                title={carouselData.landscapeLibrary.title}
                subtitle={carouselData.landscapeLibrary.subtitle}
                onClick={(startIndex) =>
                  openFullscreen(
                    carouselData.landscapeLibrary.images,
                    startIndex,
                  )
                }
                autoSlide={false}
              />
            </div>
          </div>
        </div>
      </section>
      {fullscreen.isOpen && (
        <FullscreenCarousel
          images={fullscreen.images}
          startIndex={fullscreen.startIndex}
          onClose={closeFullscreen}
        />
      )}
    </>
  );
};

export default BentoGridHero;
