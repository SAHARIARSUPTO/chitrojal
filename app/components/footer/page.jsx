import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiShield,
  FiFileText,
} from "react-icons/fi";

const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: "https://www.facebook.com/ChitroJaal",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: "https://www.instagram.com/chitrojaal_/",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: "https://www.youtube.com",
    },
  ];

  const quickLinks = [
    { name: "আমাদের সম্পর্কে", url: "/#about" },
    { name: "পোর্টফোলিও", url: "/#portfolio" },
    { name: "প্যাকেজসমূহ", url: "/#packages" },
    { name: "বুকিং করুন", url: "/booking" },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 text-neutral-400 overflow-hidden z-10 pt-16">
      {/* Ambient Glows */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 items-start">
          {/* Column 1: Brand Info & Contact */}
          <div className="flex flex-col items-start space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="ChitroJal Logo"
                  width={120}
                  height={120}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-400">
              স্মৃতির ক্যানভাসে রঙের ছোঁয়া। আপনার জীবনের সেরা মুহূর্তগুলো
              ফ্রেমবন্দী করতে আমরা আছি আপনার পাশে।
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 border border-transparent group-hover:border-orange-500/30 transition-colors">
                  <FiMapPin className="text-orange-500" size={16} />
                </div>
                <span className="text-sm mt-1">ফেনী, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 border border-transparent group-hover:border-orange-500/30 transition-colors">
                  <FiPhone className="text-orange-500" size={16} />
                </div>
                <span className="text-sm">+880 1XXX XXXXXX</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 border border-transparent group-hover:border-orange-500/30 transition-colors">
                  <FiMail className="text-orange-500" size={16} />
                </div>
                <span className="text-sm">hello@chitrojal.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg tracking-wide">
              গুরুত্বপূর্ণ লিঙ্ক
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="group flex items-center gap-2 text-sm hover:text-orange-400 transition-colors"
                  >
                    <FiArrowRight
                      className="text-orange-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                      size={14}
                    />
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Highlighted Legal & Policies */}
          <div className="relative p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 shadow-[0_0_20px_rgba(234,88,12,0.05)] overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 blur-2xl pointer-events-none"></div>

            <h3 className="font-bold text-orange-400 mb-3 text-lg tracking-wide flex items-center gap-2">
              <FiShield className="text-orange-500" /> আইনি ও শর্তাবলী
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              ফটোগ্রাফি কপিরাইট, বুকিং অ্যাডভান্স এবং র-ফাইল (Raw files)
              সংক্রান্ত আমাদের গুরুত্বপূর্ণ নীতিমালাগুলো অনুগ্রহ করে পড়ুন।
            </p>

            <ul className="space-y-4 relative z-10">
              <li>
                <Link
                  href="/privacy"
                  className="group flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-orange-500/30"
                >
                  <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500 transition-colors">
                    <FiShield
                      className="text-neutral-400 group-hover:text-white transition-colors"
                      size={14}
                    />
                  </div>
                  <span className="font-medium">প্রাইভেসি পলিসি</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/condition"
                  className="group flex items-center gap-3 text-sm text-neutral-300 hover:text-white transition-colors bg-[#0A0A0A] p-3 rounded-xl border border-white/5 hover:border-orange-500/30"
                >
                  <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-orange-500 transition-colors">
                    <FiFileText
                      className="text-neutral-400 group-hover:text-white transition-colors"
                      size={14}
                    />
                  </div>
                  <span className="font-medium">বুকিং শর্তাবলী</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div>
            <h3 className="font-bold text-white mb-6 text-lg tracking-wide">
              আমাদের খুঁজুন
            </h3>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="w-11 h-11 bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center justify-center text-neutral-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-300">
                অফার পেতে সাবস্ক্রাইব করুন
              </h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                />
                <button className="absolute right-1 top-1 bottom-1 px-3 bg-orange-600 hover:bg-orange-500 rounded-lg text-white transition-colors flex items-center justify-center">
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-orange-500">ChitroJal</span>. সর্বস্বত্ব
            সংরক্ষিত।
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-orange-400 transition-colors"
            >
              প্রাইভেসি পলিসি
            </Link>
            <Link
              href="/condition"
              className="hover:text-orange-400 transition-colors"
            >
              শর্তাবলী
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
