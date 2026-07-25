"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, X, ChevronLeft, ChevronRight } from "lucide-react";

const VideoCarousel = ({ videoData = [] }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState({ isOpen: false, video: null });
  const videoRef = useRef(null);

  const currentVideo = videoData[currentVideoIndex];

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoData.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex(
      (prevIndex) => (prevIndex - 1 + videoData.length) % videoData.length,
    );
  };

  const openFullscreen = (video) => {
    setFullscreen({ isOpen: true, video });
  };

  const closeFullscreen = () => {
    setFullscreen({ isOpen: false, video: null });
  };

  const handleFullscreenNext = () => {
    const currentIndex = videoData.findIndex(
      (v) => v.id === fullscreen.video.id,
    );
    const nextIndex = (currentIndex + 1) % videoData.length;
    setFullscreen({ isOpen: true, video: videoData[nextIndex] });
  };

  const handleFullscreenPrev = () => {
    const currentIndex = videoData.findIndex(
      (v) => v.id === fullscreen.video.id,
    );
    const prevIndex = (currentIndex - 1 + videoData.length) % videoData.length;
    setFullscreen({ isOpen: true, video: videoData[prevIndex] });
  };

  return (
    <>
      <section className="py-24 bg-[#0A0A0A] relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              আমাদের এক্সপার্টাইজ ইন মোশন
            </h2>
            <p className="text-gray-400 text-lg">
              সিনেমাটিক ফিল্মের মাধ্যমে আপনার গল্পগুলি জীবন্ত করে তোলা।
            </p>
          </div>

          <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
            <video
              ref={videoRef}
              src={currentVideo.src}
              poster={currentVideo.thumbnail}
              className="w-full h-full object-cover"
              loop
              muted
              preload="metadata"
              playsInline
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                {currentVideo.title}
              </h3>
              <p className="text-gray-300">{currentVideo.description}</p>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => openFullscreen(currentVideo)}
            >
              <Play size={64} className="text-white" />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {fullscreen.isOpen && fullscreen.video && (
        <FullscreenVideoPlayer
          video={fullscreen.video}
          onClose={closeFullscreen}
          onNext={handleFullscreenNext}
          onPrev={handleFullscreenPrev}
        />
      )}
    </>
  );
};

const FullscreenVideoPlayer = ({ video, onClose, onNext, onPrev }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement
          .play()
          .catch((e) => console.error("Autoplay was prevented:", e));
      } else {
        videoElement.pause();
      }
    }
  }, [isPlaying, video.src]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-screen-lg max-h-screen-lg">
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full object-contain"
          autoPlay
          loop
          onClick={togglePlay}
        />
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-white bg-black/50 rounded-full p-2"
          >
            <X size={32} />
          </button>
        </div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onPrev}
            className="text-white bg-black/50 rounded-full p-2"
          >
            <ChevronLeft size={48} />
          </button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={onNext}
            className="text-white bg-black/50 rounded-full p-2"
          >
            <ChevronRight size={48} />
          </button>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <button
            onClick={togglePlay}
            className="text-white bg-black/50 rounded-full p-4"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCarousel;
