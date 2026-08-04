import fs from "fs";
import path from "path";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";
import HomeClient from "./components/home/home-client";
import { readBentoSettings } from "./api/admin/bento/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const buildVideoThumbnailUrl = (sourceUrl: string) =>
  `/api/video-thumbnail?url=${encodeURIComponent(sourceUrl)}`;

const readImageDirectory = (dir: string): string[] => {
  const directoryPath = path.join(process.cwd(), "public", dir);
  try {
    if (!fs.existsSync(directoryPath)) return [];

    const allFiles = fs.readdirSync(directoryPath).filter((file) => {
      if (file === "order.json" || file.startsWith(".")) return false;
      const stat = fs.statSync(path.join(directoryPath, file));
      return stat.isFile();
    });

    const orderFilePath = path.join(directoryPath, "order.json");
    let orderedFilenames: string[] = [];

    if (fs.existsSync(orderFilePath)) {
      try {
        const content = fs.readFileSync(orderFilePath, "utf-8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          orderedFilenames = parsed.filter((name) => typeof name === "string");
        }
      } catch (e) {
        console.error(`Could not parse order.json for ${dir}`, e);
      }
    }

    const existingOrdered = orderedFilenames.filter((name) =>
      allFiles.includes(name),
    );
    const remaining = allFiles.filter((name) => !existingOrdered.includes(name));
    const finalOrder = [...existingOrdered, ...remaining];

    return finalOrder.map((file) => `/${dir}/${file}`);
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
      facebookSrc:
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      thumbnail: buildVideoThumbnailUrl(
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      ),
      title: "সিনেমাটিক ওয়েডিং ফিল্ম",
      description: "প্রেম ও উদযাপনের এক সুন্দর গল্প।",
    },
    {
      id: 2,
      facebookSrc:
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      thumbnail: buildVideoThumbnailUrl(
        "https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1484422342948146%2F&show_text=false&width=560&t=0",
      ),
      title: "ফেসবুক রিল ১",
      description: "আমাদের সাম্প্রতিক কাজ থেকে একটি রিল।",
    },
  ];

  const bentoSettings = readBentoSettings();

  return (
    <div className="bg-[#0a0a0a] text-white selection:bg-orange-500/30 min-h-screen font-sans">
      <Navbar />
      <HomeClient
        services={services}
        carouselData={carouselData}
        videoData={videoData}
        packageImages={packageImages}
        bentoSettings={bentoSettings}
      />

      <Footer />
    </div>
  );
}
