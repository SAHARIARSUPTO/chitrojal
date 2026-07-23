import React from "react";

const ChitroJalPackages = () => {
  const packages = [
    {
      id: 1,
      title: "বেসিক প্যাকেজ",
      price: "৳৫,০০০",
      features: [
        "২ ঘণ্টা শুট",
        "৫০ এডিটেড ছবি",
        "১টি প্রমো ভিডিও",
        "অনলাইন গ্যালারি ডেলিভারি",
      ],
      isPopular: false,
    },
    {
      id: 2,
      title: "স্ট্যান্ডার্ড প্যাকেজ",
      price: "৳১০,০০০",
      features: [
        "৪ ঘণ্টা শুট",
        "১০০ এডিটেড ছবি",
        "হাইলাইট ভিডিও",
        "১টি ফটোবুক (১০ পাতা)",
        "কালার কারেকশন",
      ],
      isPopular: true,
    },
    {
      id: 3,
      title: "প্রিমিয়াম প্যাকেজ",
      price: "৳২০,০০০",
      features: [
        "ফুল ডে শুট (৮ ঘণ্টা)",
        "আনলিমিটেড ছবি",
        "সিনেমাটিক ভিডিও",
        "ড্রোন শট",
        "২টি প্রিমিয়াম ফটোবুক",
      ],
      isPopular: false,
    },
  ];

  return (
    <section className="relative bg-[#050505] py-24 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center overflow-hidden font-sans">
      {/* Ambient Background Glows (No Blue, Only Orange & Warm Neutrals) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none translate-y-[30%]"></div>

      {/* Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-600 mb-6 drop-shadow-lg tracking-tight">
          চিত্রজাল এক্সক্লুসিভ
        </h2>
        <p className="text-[#a0a0a0] text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          আপনার বিশেষ মুহূর্তগুলোকে ফ্রেমে বন্দী করতে আমাদের প্রিমিয়াম
          প্যাকেজসমূহ নির্বাচন করুন।
        </p>
      </div>

      {/* Sliding Cards Container */}
      <div
        className="relative z-10 flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-12 pt-4 px-4 md:px-0 max-w-7xl mx-auto w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `::-webkit-scrollbar { display: none; }`,
          }}
        />

        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 rounded-[2rem] p-8 flex flex-col justify-between transition-all duration-700 ease-out group hover:-translate-y-4 hover:scale-[1.02] ${
              pkg.isPopular
                ? "bg-[#0a0a0a]/80 shadow-[0_0_40px_rgba(234,88,12,0.15)]"
                : "bg-[#0a0a0a]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
            } backdrop-blur-xl border border-white/5`}
          >
            {/* Glossy Overlay for Glassmorphism */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none"></div>

            {/* Hover Animated Gradient Border */}
            <div
              className={`absolute -inset-[1px] rounded-[2rem] -z-10 bg-gradient-to-br transition-all duration-700 opacity-0 group-hover:opacity-100 ${
                pkg.isPopular
                  ? "from-orange-500 to-orange-900 opacity-100 blur-[2px]"
                  : "from-orange-500/50 to-transparent"
              }`}
            ></div>

            {/* Popular Badge */}
            {pkg.isPopular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(234,88,12,0.5)] border border-orange-400/50 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                </span>
                জনপ্রিয় পছন্দ
              </div>
            )}

            <div className="relative z-10">
              <h3
                className={`text-2xl font-bold mb-4 transition-colors ${pkg.isPopular ? "text-white" : "text-neutral-300 group-hover:text-white"}`}
              >
                {pkg.title}
              </h3>

              <div className="mb-8 border-b border-white/10 pb-8 relative">
                <span className="text-5xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent drop-shadow-md">
                  {pkg.price}
                </span>
              </div>

              <ul className="space-y-5 mb-10">
                {pkg.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-neutral-300 font-medium text-md group/item"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mr-4 border border-white/10 group-hover/item:border-orange-500/50 group-hover/item:bg-orange-500/10 transition-colors shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-orange-500 drop-shadow-[0_0_5px_rgba(234,88,12,0.8)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="group-hover/item:text-white transition-colors">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Premium Glossy Button */}
            <button
              className={`w-full relative overflow-hidden font-bold text-lg py-4 rounded-xl transition-all duration-300 transform active:scale-95 group/btn z-10 ${
                pkg.isPopular
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)] border-none"
                  : "bg-white/5 text-orange-400 hover:text-white border border-white/10 hover:border-orange-500/50"
              }`}
            >
              {/* Button Inner Gloss */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>

              {/* Button Hover Fill (For non-popular cards) */}
              {!pkg.isPopular && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10"></span>
              )}

              <span className="relative flex items-center justify-center gap-2">
                এখনই বুক করুন
                <svg
                  className="w-5 h-5 transform group-hover/btn:translate-x-1.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChitroJalPackages;
