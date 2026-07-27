"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ContactSection from "../contacts/page";
import BentoGridHero from "./BentoGridHero";
import VideoCarousel from "./VideoCarousel";
import { Phone, CheckCircle2 } from "lucide-react";
import QuotesShowcase from "../section1/page";

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

const HomeClient = ({ carouselData, videoData, packageImages }) => {
  return (
    <main>
      <BentoGridHero carouselData={carouselData} packageImages={packageImages} />

      <section className="py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-y-8 md:gap-y-0">
            <StatItem number="১০+" text="হ্যাপি ক্লায়েন্ট" />
            <StatItem number="৫০+" text="ইভেন্ট কভারড" />
            <StatItem number="০৫+" text="বছরের অভিজ্ঞতা" />
            <StatItem number="১০০%" text="স্যাটিসফ্যাকশন" />
          </div>
        </div>
      </section>

      <ContactSection />
      <VideoCarousel videoData={videoData} />
      <QuotesShowcase />

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
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              কেন আমাদের{" "}
              <span className="text-orange-500 italic font-serif">
                বেছে নেবেন?
              </span>
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

      <section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 bg-cover bg-fixed bg-center"></div>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-6 font-serif">
            আপনার স্পেশাল দিনটি <br />{" "}
            <span className="text-orange-500 font-serif">বুক করুন</span>
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
