"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// Assuming you have these components in your project
import Navbar from "../components/navbar/page";
import Footer from "../components/footer/page";

import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";

const bengaliEventTypes = [
  "বিয়ে",
  "গায়ে হলুদ",
  "বৌভাত",
  "জন্মদিন",
  "অন্নপ্রাশন",
  "বিবাহবার্ষিকী",
  "কর্পোরেট ইভেন্ট",
  "অন্যান্য",
];

const packageOptions = [
  { name: "প্যাকেজ নির্বাচন করুন", slug: "" },
  { name: "সিলভার প্যাকেজ", slug: "silver" },
  { name: "গোল্ড প্যাকেজ", slug: "gold" },
  { name: "প্লাটিনাম প্যাকেজ", slug: "platinum" },
];

// Premium Custom Calendar Component
interface CalendarProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
}

const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between py-4 mb-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-lg font-bold text-white tracking-wide">
          {format(currentMonth, "MMMM yyyy")}
        </div>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(new Date());
    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="text-center text-xs font-bold uppercase tracking-widest text-neutral-500 py-2"
          key={i}
        >
          {format(addDays(startDate, i), "E")}
        </div>,
      );
    }
    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate || new Date(0));
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            onClick={() => onDateChange(cloneDay)}
            className={`relative p-1 h-12 w-full flex items-center justify-center text-sm cursor-pointer transition-all duration-300 group`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                !isCurrentMonth
                  ? "text-neutral-700 hover:text-neutral-400"
                  : isSelected
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-110"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {formattedDate}
            </div>
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day.toString()}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

function BookingPageContents() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    eventType: bengaliEventTypes[0],
    selectedPackage: "",
    bookingDays: 1,
    eventDate: new Date(),
    message: "",
    agreedToTerms: false, // Added state for Terms & Conditions
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const packageSlug = searchParams.get("package");
    if (packageSlug) {
      setFormData((prev) => ({ ...prev, selectedPackage: packageSlug }));
    }
  }, [searchParams]);

  // Updated to handle both text inputs and checkboxes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, eventDate: date }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Extra safety check for terms
    if (!formData.agreedToTerms) {
      setSubmitStatus({
        success: false,
        message:
          "অনুগ্রহ করে বুকিং শর্তাবলী এবং প্রাইভেসি পলিসিতে সম্মতি প্রদান করুন।",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/booking-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message:
            "আপনার বুকিং অনুরোধ সফলভাবে জমা হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
        });
        // Optional: Reset form fields here
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      let message = "একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
      if (error instanceof Error) {
        message = error.message;
      }
      setSubmitStatus({
        success: false,
        message: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-orange-200 to-orange-600 mb-6 drop-shadow-lg tracking-tight">
          ইভেন্ট বুকিং
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          আপনার বিশেষ দিনটিকে ফ্রেমবন্দি করতে আজই আপনার পছন্দের তারিখ ও
          প্যাকেজ নির্বাচন করুন।
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Calendar Section */}
        <div className="lg:col-span-5 order-first lg:order-last">
          <div className="sticky top-32 space-y-6">
            <div className="flex items-center gap-3 text-white">
              <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <FiCalendar className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">তারিখ নির্বাচন করুন</h3>
                <p className="text-sm text-neutral-400">
                  উপলব্ধ তারিখগুলো থেকে আপনার ইভেন্টের দিনটি বেছে নিন
                </p>
              </div>
            </div>
            <Calendar
              selectedDate={formData.eventDate}
              onDateChange={handleDateChange}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7 bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="relative space-y-8">
            {/* Personal Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                  placeholder="e.g. Supto"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                  ইমেইল
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                ফোন নম্বর
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                placeholder="+880 1XXX XXXXXX"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                ইভেন্টের ঠিকানা
              </label>
              <textarea
                name="location"
                rows={3}
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner resize-none"
                placeholder="ভেন্যু বা বাসার ঠিকানা..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                প্যাকেজ
              </label>
              <select
                name="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                }}
              >
                {packageOptions.map((pkg) => (
                  <option
                    key={pkg.slug}
                    value={pkg.slug}
                    disabled={pkg.slug === ""}
                    className="bg-[#0A0A0A] text-white"
                  >
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                  ইভেন্টের ধরন
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  {bengaliEventTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                      className="bg-[#0A0A0A] text-white"
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                  বুকিং এর দিন সংখ্যা
                </label>
                <input
                  type="number"
                  name="bookingDays"
                  min="1"
                  value={formData.bookingDays}
                  onChange={handleInputChange}
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400 font-semibold pl-1">
                আপনার বার্তা (ঐচ্ছিক)
              </label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner resize-none"
                placeholder="বিশেষ কোন রিকোয়ারমেন্ট থাকলে এখানে লিখুন..."
              ></textarea>
            </div>

            {/* Terms and Conditions Agreement Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="agreedToTerms"
                  name="agreedToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border border-white/20 bg-[#050505] text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer accent-orange-500"
                />
              </div>
              <div className="text-sm text-neutral-400 leading-tight">
                <label htmlFor="agreedToTerms" className="cursor-pointer">
                  আমি চিত্রজাল-এর{" "}
                  <Link
                    href="/condition"
                    target="_blank"
                    className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
                  >
                    বুকিং শর্তাবলী
                  </Link>{" "}
                  এবং{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-2"
                  >
                    প্রাইভেসি পলিসি
                  </Link>{" "}
                  পড়েছি এবং সম্মতি প্রদান করছি।
                </label>
              </div>
            </div>

            {/* Status Message Display */}
            {submitStatus && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  submitStatus.success
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {submitStatus.success ? (
                  <FiCheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <FiAlertCircle className="w-6 h-6 shrink-0" />
                )}
                <p className="text-sm font-medium">
                  {submitStatus.message}
                </p>
              </div>
            )}

            {/* Premium Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreedToTerms}
              className="w-full relative overflow-hidden font-bold text-lg py-5 rounded-xl transition-all duration-300 transform active:scale-[0.98] group bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    প্রসেস হচ্ছে...
                  </>
                ) : (
                  "বুকিং অনুরোধ পাঠান"
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
    return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-neutral-200 font-sans selection:bg-orange-500/30">
      <Navbar />

      <main className="flex-1 relative overflow-hidden py-16 md:py-24">
        {/* Ambient Studio Lighting Background */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        <Suspense fallback={<div>Loading...</div>}>
            <BookingPageContents />
        </Suspense>
      </main>

      <Footer />
    </div>
    )
}
