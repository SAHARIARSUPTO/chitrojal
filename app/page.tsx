import fs from "fs";
import path from "path";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import ChitroJalPackages from "./components/home/packages/page";
import HomeClient from "./components/home/home-client";
import { Camera, Video, Heart, Aperture } from "lucide-react";

export default function Home() {
  // Data for the services section. You can manage this here.
  const services = [
    {
      icon: "Heart",
      title: "ওয়েডিং ফটোগ্রাফি",
      slug: "wedding-photography",
      description:
        "জীবনের সবচেয়ে বিশেষ দিনের প্রতিটি মুহূর্ত, হাসি এবং আবেগগুলো আমরা ফ্রেমবন্দি করি একদম প্রিমিয়াম স্টাইলে।",
      image: "",
    },
    {
      icon: "Video",
      title: "সিনেমাটিক ওয়েডিং",
      slug: "cinematic-wedding",
      description:
        "আপনার বিয়ের গল্পকে একটি সুন্দর সিনেমার রূপ দিতে আমাদের আছে এক্সপার্ট সিনেমাটোগ্রাফি টিম।",
      image: "",
    },
    {
      icon: "Camera",
      title: "প্রি-ওয়েডিং শ্যুট",
      slug: "pre-wedding-shoot",
      description:
        "বিয়ের আগের মিষ্টি মুহূর্তগুলো আর কাপল কেমিস্ট্রি ফুটিয়ে তুলতে দারুণ সব লোকেশনে স্পেশাল শ্যুট।",
      image: "",
    },
    {
      icon: "Aperture",
      title: "গায়ে হলুদ ও মেহেদী",
      slug: "holud-and-mehendi",
      description:
        "হলুদের উৎসবের রঙিন মুহূর্তগুলো আরও প্রাণবন্ত করে তুলবে আমাদের কালারফুল ফটোগ্রাফি।",
      image: "",
    },
  ];

  // Read images from the hero-image folder
  const heroImageDir = path.join(process.cwd(), "public", "hero-image");
  let heroImages: string[] = [];
  try {
    if (fs.existsSync(heroImageDir)) {
      heroImages = fs
        .readdirSync(heroImageDir)
        .map((file) => `/hero-image/${file}`);
    }
  } catch (error) {
    console.error("Could not read hero-image directory:", error);
  }

  // Read images from the portfolio folder
  const portfolioDir = path.join(process.cwd(), "public", "portfolio");
  let portfolioImages: string[] = [];
  try {
    if (fs.existsSync(portfolioDir)) {
      portfolioImages = fs
        .readdirSync(portfolioDir)
        .map((file) => `/portfolio/${file}`);
    }
  } catch (error) {
    console.error("Could not read portfolio directory:", error);
  }

  // Read video from the about-video folder
  const aboutVideoDir = path.join(process.cwd(), "public", "about-video");
  let aboutVideo = "";
  try {
    if (fs.existsSync(aboutVideoDir)) {
      const files = fs.readdirSync(aboutVideoDir);
      if (files.length > 0) {
        aboutVideo = `/about-video/${files[0]}`; // Get the first video
      }
    }
  } catch (error) {
    console.error("Could not read about-video directory:", error);
  }

  return (
    <div className="bg-[#050505] text-white selection:bg-orange-500/30 min-h-screen font-sans">
      <Navbar />
      <HomeClient
        services={services}
        portfolioImages={portfolioImages}
        heroImages={heroImages}
        aboutVideo={aboutVideo}
      />

      <Footer />
    </div>
  );
}
