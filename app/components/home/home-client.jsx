"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import BentoGridHero from "./BentoGridHero"; // Import the new hero component
import VideoCarousel from "./VideoCarousel"; // Import the new video carousel component
import {
  Camera,
  Video,
  Heart,
  Calendar,
  ChevronRight,
  Aperture,
  Image as ImageIcon,
  Phone,
  Play,
  CheckCircle2,
} from "lucide-react";

const iconComponents = {
  Heart: <Heart size={24} />,
  Video: <Video size={24} />,
  Camera: <Camera size={24} />,
  Aperture: <Aperture size={24} />,
};

// --- Reusable Components ---

const StatItem = ({ number, text }) => (
  <div className="text-center px-6 border-r border-white/10 last:border-0">
    <h4 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-2">
      {number}
    </h4>
    <p className="text-gray-400 uppercase tracking-widest text-xs md:text-sm">
      {text}
    </p>
  </div>
);

const HomeClient = ({ portfolioImages, carouselData, videoData, services }) => {
  return (
    <main>
      {/* --- New Bento Grid Hero Section --- */}
      <BentoGridHero carouselData={carouselData} />

      {/* --- Quick Stats Bar --- */}
      <section className="py-12 border-b border-white/5 bg-[#0A0A0A]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-y-8 md:gap-y-0">
            <StatItem number="১০+" text="হ্যাপি কাপল" />
            <StatItem number="৫০+" text="ইভেন্ট কভারড" />
            <StatItem number="০৫+" text="বছরের অভিজ্ঞতা" />
            <StatItem number="১০০%" text="স্যাটিসফ্যাকশন" />
          </div>
        </div>
      </section>

      <VideoCarousel videoData={videoData} />

      {/* --- Portfolio Preview Grid (Masonry Style) --- */}
      <section
        id="portfolio"
        className="py-24 bg-[#0A0A0A] relative border-y border-white/5"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <Aperture size={32} className="text-orange-500 mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              রিসেন্ট{" "}
              <span className="text-orange-500 italic font-serif">
                পোর্টফোলিও
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              আমাদের লেন্সের চোখে দেখা কিছু ভালোবাসার মুহূর্ত।
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,_auto)]">
            {portfolioImages.map((image, index) => {
              const patterns = [
                "col-span-2 row-span-2", // Large
                "col-span-1 row-span-1", // Small
                "col-span-1 row-span-2", // Tall
                "col-span-1 row-span-1", // Small
                "col-span-2 row-span-1", // Wide
              ];
              const pattern = patterns[index % patterns.length];

              return (
                <motion.div
                  key={image}
                  className={`${pattern} relative overflow-hidden rounded-2xl`}
                >
                  <Image
                    src={image}
                    alt={`Portfolio Image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    quality={90}
                  />
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://www.facebook.com/ChitroJaal"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-full border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              আরও গ্যালারি দেখুন
            </a>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us Section --- */}
      <section id="about" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 w-full">
            <div className="relative aspect-video md:aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-orange-900/20">
              <Image
                src="/why_us.jpg"
                alt="Why Choose ChitroJal"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              কেন আমাদের{" "}
              <span className="text-orange-500 italic">বেছে নেবেন?</span>
            </h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">
              চিত্রজাল শুধু ছবি তোলে না, আমরা আবেগ এবং ভালোবাসার গল্প বুনি।
              আমাদের এক্সপেরিয়েন্সড টিম আপনার স্পেশাল দিনটিকে করে তুলবে একদম
              পারফেক্ট।
            </p>

            <div className="space-y-4">
              {[
                "প্রফেশনাল এবং ক্রিয়েটিভ ফটোগ্রাফার টিম",
                "আধুনিক সিনেমাটিক গিয়ার্স ও ইকুইপমেন্ট",
                "অত্যন্ত যত্নশীল এডিটিং ও কালার গ্রেডিং",
                "সময়মতো ছবি ও ভিডিও ডেলিভারি",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                >
                  <CheckCircle2 className="text-orange-500" size={24} />
                  <span className="text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Booking CTA Section --- */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 bg-cover bg-fixed bg-center"></div>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6">
            আপনার স্পেশাল দিনটি <br />{" "}
            <span className="text-orange-500">বুক করুন</span>
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-10">
            আমাদের ডেটগুলো খুব দ্রুত বুক হয়ে যায়। তাই আপনার ইভেন্টের তারিখ
            কনফার্ম করতে আজই যোগাযোগ করুন আমাদের সাথে।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <motion.button
                className="bg-orange-600 text-white font-bold px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-[0_0_30px_rgba(255,122,0,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                বুকিং ফর্ম পূরণ করুন
              </motion.button>
            </Link>
            <motion.button
              className="bg-white/10 border border-white/20 text-white font-semibold px-8 py-3 sm:px-10 sm:py-4 rounded-full backdrop-blur-md flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} /> কল করুন: +8801834258375
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeClient;
