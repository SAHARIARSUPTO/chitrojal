"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ServicesSection from "./services-section"; // Import the new component
import ChitroJalPackages from "./packages/page";
import { useState, useEffect } from "react";
import Image from "next/image";
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

const HomeClient = ({ services, portfolioImages, heroImages, aboutVideo }) => {
  // Assign images to grid items. This can be made more robust.
  const gridImages = [
    portfolioImages[0] || "",
    portfolioImages[1] || "",
    portfolioImages[2] || "",
    portfolioImages[3] || "",
    portfolioImages[4] || "",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    // Set the initial random image only on the client
    setCurrentImageIndex(Math.floor(Math.random() * heroImages.length));

    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % heroImages.length,
        );
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  return (
    <main>
      {/* --- Cinematic Hero Section --- */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Hero Background Image with Parallax effect */}
        {heroImages.length > 0 &&
          heroImages.map((image, index) => (
            <div
              key={image}
              className="absolute inset-0 bg-cover bg-center scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate] transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${image})`,
                opacity: index === currentImageIndex ? 1 : 0,
                zIndex: index === currentImageIndex ? 1 : 0,
              }}
            ></div>
          ))}

        {/* Deep Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

        <motion.div
          className="relative z-10 px-4 max-w-5xl mx-auto text-center pt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/logo.png"
              alt="ChitroJal Logo"
              width={420}
              height={420}
              className="mx-auto w-36 h-auto hidden md:block"
            />
          </motion.div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight [text-shadow:_0_3px_15px_rgba(0,0,0,0.5)]">
            স্মৃতির ক্যানভাসে <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              রঙের ছোঁয়া
            </span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-lg md:text-2xl text-gray-200 font-light leading-relaxed [text-shadow:_0_2px_10px_rgba(0,0,0,0.8)] font-bengali">
            জীবনের সেরা মুহূর্তগুলো শুধু ছবি নয়, এগুলো এক একটি গল্প।{" "}
            <span className="text-orange-400 font-medium font-english text-2xl md:text-3xl">
              ChitroJal
            </span>
            -এর সাথে আপনার গল্পগুলো বেঁচে থাকুক আজীবন।
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 items-center">
            <Link href="/booking">
              <motion.button
                className="sm:w-auto bg-orange-600 text-white font-bold px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-[0_0_30px_rgba(255,122,0,0.4)] hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar size={20} /> ইভেন্ট বুক করুন
              </motion.button>
            </Link>
            <motion.button
              className="sm:w-auto flex items-center justify-center gap-3 text-white font-medium hover:text-orange-400 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Play size={18} className="ml-1" />
              </div>
              আমাদের শো-রিল দেখুন
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-english">
            Scroll Down
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500 to-transparent"></div>
        </motion.div>
      </section>

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

      <ChitroJalPackages />

      <ServicesSection services={services} heroImages={heroImages} />

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
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            আপনার স্পেশাল দিনটি <br />{" "}
            <span className="text-orange-500">বুক করুন</span>
          </h2>
          <p className="text-lg text-gray-300 mb-10">
            আমাদের ডেটগুলো খুব দ্রুত বুক হয়ে যায়। তাই আপনার ইভেন্টের তারিখ
            কনফার্ম করতে আজই যোগাযোগ করুন আমাদের সাথে।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/booking">
              <motion.button
                className="bg-orange-600 text-white font-bold px-10 py-4 rounded-full shadow-[0_0_30px_rgba(255,122,0,0.4)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                বুকিং ফর্ম পূরণ করুন
              </motion.button>
            </Link>
            <motion.button
              className="bg-white/10 border border-white/20 text-white font-semibold px-10 py-4 rounded-full backdrop-blur-md flex items-center justify-center gap-2"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone size={20} /> কল করুন: +880 1234-567890
            </motion.button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeClient;
