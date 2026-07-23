import Navbar from "@/app/components/navbar/page";
import Footer from "@/app/components/footer/page";
import { Camera, CheckCircle, Package, DollarSign } from "lucide-react";

const serviceDetails = {
  "wedding-photography": {
    title: "ওয়েডিং ফটোগ্রাফি",
    description:
      "জীবনের সবচেয়ে বিশেষ দিনের প্রতিটি মুহূর্ত, হাসি এবং আবেগগুলো আমরা ফ্রেমবন্দি করি একদম প্রিমিয়াম স্টাইলে।",
    imageUrl: "",
  },
  "cinematic-wedding": {
    title: "সিনেমাটিক ওয়েডিং",
    description:
      "আপনার বিয়ের গল্পকে একটি সুন্দর সিনেমার রূপ দিতে আমাদের আছে এক্সপার্ট সিনেমাটোগ্রাফি টিম।",
    imageUrl: "",
  },
  "pre-wedding-shoot": {
    title: "প্রি-ওয়েডিং শ্যুট",
    description:
      "বিয়ের আগের মিষ্টি মুহূর্তগুলো আর কাপল কেমিস্ট্রি ফুটিয়ে তুলতে দারুণ সব লোকেশনে স্পেশাল শ্যুট।",
    imageUrl: "",
  },
  "holud-and-mehendi": {
    title: "গায়ে হলুদ ও মেহেদী",
    description:
      "হলুদের উৎসবের রঙিন মুহূর্তগুলো আরও প্রাণবন্ত করে তুলবে আমাদের কালারফুল ফটোগ্রাফি।",
    imageUrl: "",
  },
};

export default function ServicePage({ params }) {
  const service = serviceDetails[params.slug] || {
    title: "Service Not Found",
    description: "",
    imageUrl: "",
  };

  return (
    <div className="bg-[#050505] text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-24 pt-32">
        {/* Page content will go here */}
      </main>
      <Footer />
    </div>
  );
}
