import fs from "fs";
import path from "path";
import Navbar from "../navbar/page";
import Footer from "../footer/page";
import HomeClient from "./home-client";
import { Camera, Video, Heart, Aperture } from "lucide-react";

// --- Main Page Component ---

const HomePage = () => {
  const portfolioDir = path.join(process.cwd(), "public", "portfolio");
  let portfolioImages = [];
  try {
    if (fs.existsSync(portfolioDir)) {
      portfolioImages = fs
        .readdirSync(portfolioDir)
        .map((file) => `/portfolio/${file}`);
    }
  } catch (error) {
    console.error("Could not read portfolio directory:", error);
    // Keep portfolioImages as an empty array
  }

  const services = [
    {
      icon: <Heart size={24} />,
      title: "ওয়েডিং ফটোগ্রাফি",
      slug: "wedding-photography",
      description:
        "জীবনের সবচেয়ে বিশেষ দিনের প্রতিটি মুহূর্ত, হাসি এবং আবেগগুলো আমরা ফ্রেমবন্দি করি একদম প্রিমিয়াম স্টাইলে।",
      image: "",
    },
    {
      icon: <Video size={24} />,
      title: "সিনেমাটিক ওয়েডিং",
      slug: "cinematic-wedding",
      description:
        "আপনার বিয়ের গল্পকে একটি সুন্দর সিনেমার রূপ দিতে আমাদের আছে এক্সপার্ট সিনেমাটোগ্রাফি টিম।",
      image: "",
    },
    {
      icon: <Camera size={24} />,
      title: "প্রি-ওয়েডিং শ্যুট",
      slug: "pre-wedding-shoot",
      description:
        "বিয়ের আগের মিষ্টি মুহূর্তগুলো আর কাপল কেমিস্ট্রি ফুটিয়ে তুলতে দারুণ সব লোকেশনে স্পেশাল শ্যুট।",
      image: "",
    },
    {
      icon: <Aperture size={24} />,
      title: "গায়ে হলুদ ও মেহেদী",
      slug: "holud-and-mehendi",
      description:
        "হলুদের উৎসবের রঙিন মুহূর্তগুলো আরও প্রাণবন্ত করে তুলবে আমাদের কালারফুল ফটোগ্রাফি।",
      image: "",
    },
  ];

  return (
    <div className="bg-[#050505] text-white selection:bg-orange-500/30 min-h-screen font-sans">
      <Navbar />
      <HomeClient services={services} portfolioImages={portfolioImages} />
      <Footer />
    </div>
  );
};

export default HomePage;
