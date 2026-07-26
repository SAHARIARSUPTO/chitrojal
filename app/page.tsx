import fs from "fs";
import path from "path";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import HomeClient from "./components/home/home-client";
import { Camera, Video, Heart, Aperture } from "lucide-react";

const readImageDirectory = (dir: string): string[] => {
  const directoryPath = path.join(process.cwd(), "public", dir);
  try {
    if (fs.existsSync(directoryPath)) {
      return fs.readdirSync(directoryPath).map((file) => `/${dir}/${file}`);
    }
  } catch (error) {
    console.error(`Could not read directory: ${dir}`, error);
  }
  return [];
};

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

  // Read images from the portfolio folder
  const portfolioImages = readImageDirectory("portfolio");
  const portraitImages = readImageDirectory("portrait-library");
  const landscapeImages = readImageDirectory("landscape-library");
  const packageImages = readImageDirectory("package");

  const carouselData = {
    portfolio: {
      title: "PORTFOLIO",
      subtitle: "Our recent works",
      images: portfolioImages,
    },
    portraitLibrary: {
      title: "PHOTO LIBRARY",
      subtitle: "Portrait collection",
      images: portraitImages,
    },
    landscapeLibrary: {
      title: "PHOTO LIBRARY",
      subtitle: "Landscape collection",
      images: landscapeImages,
    },
  };

  const videoData = [
    {
      id: 1,
      localSrc: "/videos/01.mp4",
      thumbnail: portfolioImages[0] || "", // Use first portfolio image as a fallback thumbnail
      title: "সিনেমাটিক ওয়েডিং ফিল্ম",
      description: "প্রেম ও উদযাপনের এক সুন্দর গল্প।",
    },
    {
      id: 2,
      facebookSrc:
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      thumbnail: portfolioImages[1] || "", // Placeholder thumbnail
      title: "ফেসবুক রিল ১",
      description: "আমাদের সাম্প্রতিক কাজ থেকে একটি রিল।",
    },
  ];

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-orange-500/30 min-h-screen font-sans">
      <Navbar />
      <HomeClient
        services={services}
        portfolioImages={portfolioImages}
        carouselData={carouselData}
        videoData={videoData}
        packageImages={packageImages}
      />

      <Footer />
    </div>
  );
}
