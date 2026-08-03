"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/app/components/home/AdminLayout";
import {
  FiBook,
  FiShield,
  FiUsers,
  FiFileText,
  FiDollarSign,
  FiLink,
  FiCamera,
  FiLock,
  FiMessageCircle,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiBriefcase,
  FiExternalLink,
  FiSearch,
  FiHelpCircle,
  FiAlertCircle,
} from "react-icons/fi";

type ManualTopic = {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  summary: string;
  steps: string[];
  tips?: string;
};

export default function UserManualPage() {
  const [userRole, setUserRole] = useState<"admin" | "staff" | null>(null);
  const [activeTab, setActiveTab] = useState<"admin" | "staff">("admin");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "b-1": true,
    "s-1": true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const role = data.user?.accessRole === "staff" ? "staff" : "admin";
          setUserRole(role);
          setActiveTab(role);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Detailed Admin Manual Sections
  const adminTopics: ManualTopic[] = [
    {
      id: "b-1",
      title: "১. বুকিং ও ইভেন্ট ব্যবস্থাপনা (Booking Management)",
      category: "Event Workflow",
      icon: FiBriefcase,
      summary: "নতুন ক্লায়েন্ট বুকিং এন্ট্রি করা, ইভেন্ট শিডিউল সেট করা এবং পেমেন্ট ট্র্যাকিং করা।",
      steps: [
        "ধাপ ১: বাম পাশের মেনু থেকে 'Booking Management' এ প্রবেশ করুন এবং 'New Event' বাটনে ক্লিক করুন।",
        "ধাপ ২: ক্লায়েন্টের নাম, সচল মোবাইল নম্বর, এবং ইভেন্টের ঠিকানা/ভেন্যু সঠিকভাবে ইনপুট দিন।",
        "ধাপ ৩: ইভেন্টের ধরন (যেমন: Wedding, Reception, Engagement, Birthday, Corporate) নির্বাচন করুন।",
        "ধাপ ৪: ইভেন্ট শিডিউল নির্ধারণ করুন। এক বা একাধিক দিন হলে 'Day Shift' বা 'Night Shift' নির্দিষ্ট করুন।",
        "ধাপ ৫: আর্থিক তথ্য এন্ট্রি করুন — মোট চুক্তি মূল্য (Total Contract Amount) এবং ক্লায়েন্ট কর্তৃক প্রদত্ত অগ্রিম (Advance Paid)। অবশিষ্ট বাকি টাকা (Due Amount) সিস্টেম স্বয়ংক্রিয়ভাবে হিসাব করবে।",
        "ধাপ ৬: বুকিংয়ের বর্তমান স্ট্যাটাস সিলেক্ট করুন — Pending (কথাবার্তা চলছে), Confirmed (বুকিং নিশ্চিত), Completed (কাজ সম্পন্ন) অথবা Cancelled (বাতিল)।",
        "ধাপ ৭: তথ্য ঠিক থাকলে 'Save Event' চাপুন। নতুন বুকিংটি মূল তালিকায় যুক্ত হয়ে যাবে।",
      ],
      tips: "পরামর্শ: ইভেন্টের দিন স্টাফ অ্যাসাইন করার আগে ক্লায়েন্টের মোবাইল নম্বরটি ঠিক আছে কিনা তা নিশ্চিত করুন।",
    },
    {
      id: "b-2",
      title: "২. ডিজিটাল ইনভয়েস তৈরি ও পরিচালনা (Invoice Management)",
      category: "Billing",
      icon: FiFileText,
      summary: "অটোমেটেড পেশাদার PDF ইনভয়েস প্রিভিউ, ডিসকাউন্ট যুক্ত করা এবং ক্লায়েন্ট কপি ডাউনলোড।",
      steps: [
        "ধাপ ১: 'Invoices' পেজে যান। সকল বুকিংয়ের একটি তালিকা দেখতে পাবেন।",
        "ধাপ ২: নির্দিষ্ট ইভেন্টের পাশে থাকা 'View Invoice' বা ক্লিক করে ইনভয়েস প্রিভিউ পেজে প্রবেশ করুন।",
        "ধাপ ৩: ইনভয়েসে ইভেন্ট আইডি, প্যাকেজের বিবরণ, শিডিউল তারিখ, মোট বিল, জমার পরিমাণ এবং কিউআর/বারকোড স্বয়ংক্রিয়ভাবে সজ্জিত থাকবে।",
        "ধাপ ৪: ক্লায়েন্টকে কোনো বিশেষ ছাড় বা ডিসকাউন্ট দেওয়া হলে তা ইনভয়েস এডিটর থেকে যুক্ত করা যায়।",
        "ধাপ ৫: 'Open PDF' এ ক্লিক করলে নতুন ব্রাউজার ট্যাবে ইনভয়েস প্রিন্ট লেআউট খুলবে।",
        "ধাপ ৬: 'Download PDF' বাটনে চাপ দিলে সরাসরি ডিভাইসে ইনভয়েসের পিডিএফ ফাইল ডাউনলোড হয়ে যাবে।",
      ],
      tips: "পরামর্শ: ক্লায়েন্টকে ইনভয়েস পাঠানোর আগে অগ্রিম জমার রসিদ হিসাব ঠিক আছে কিনা ইনভয়েস প্রিভিউতে দেখে নিন।",
    },
    {
      id: "b-3",
      title: "৩. ফিনান্স ও আয়-ব্যয় হিসেব (Finance Management)",
      category: "Accounting",
      icon: FiDollarSign,
      summary: "মাসিক মোট আয়, প্রাতিষ্ঠানিক খরচ এন্ট্রি এবং নিট লাভ-ক্ষতির পূর্ণাঙ্গ হিসাব রিপোর্ট।",
      steps: [
        "ধাপ ১: 'Finance' মেনুতে যান। পেজের শীর্ষে চলতি মাসের মোট আয়, মোট খরচ এবং নিট লাভের সারসংক্ষেপ দেখতে পাবেন।",
        "ধাপ ২: নতুন কোনো প্রাতিষ্ঠানিক বা ইভেন্ট সংক্রান্ত খরচ যুক্ত করতে 'Add Expense' বাটনে ক্লিক করুন।",
        "ধাপ ৩: খরচের বিবরণ (যেমন: কনভেয়েন্স, ক্যামেরা রেন্টাল, এডিটিং ফি, অফিস খরচ), ক্যাটাগরি এবং টাকার পরিমাণ ইনপুট দিয়ে সেভ করুন।",
        "ধাপ ৪: যেকোনো নির্দিষ্ট মাসের ফিনান্সিয়াল স্টেটমেন্ট দেখতে মাস নির্বাচন করুন।",
        "ধাপ ৫: 'Download Report' বাটনে ক্লিক করে পুরো মাসের আয়-ব্যয়ের অফিশিয়াল PDF রিপোর্ট ডাউনলোড করুন।",
      ],
      tips: "পরামর্শ: প্রতি সপ্তাহে ছোট ছোট খরচগুলো সঙ্গে সঙ্গে এন্ট্রি করলে মাসের শেষে নির্ভুল লাভ-ক্ষতির হিসাব পাওয়া যায়।",
    },
    {
      id: "b-4",
      title: "৪. ফটো ড্রাইভ ও ক্লায়েন্ট ডেলিভারি লিংক (Photo Drive Link)",
      category: "Media Delivery",
      icon: FiLink,
      summary: "ক্লায়েন্টদের ফাইনাল ডেলিভারির জন্য গুগল ড্রাইভ বা অনলাইন গ্যালারি লিংক সংরক্ষণ ও শেয়ার।",
      steps: [
        "ধাপ ১: 'Photo Link' মেনুতে প্রবেশ করুন।",
        "ধাপ ২: কাঙ্ক্ষিত ইভেন্টটি খুঁজে বের করুন এবং 'Add/Edit Drive Link' এ ক্লিক করুন।",
        "ধাপ ৩: গুগল ড্রাইভ বা ক্লাউড গ্যালারির শেয়ারিং লিংকটি পেস্ট করে সেভ করুন।",
        "ধাপ ৪: লিংক সেভ হলে 'Copy Link' বাটনে ক্লিক করে সরাসরি ক্লায়েন্ট বা টিম মেম্বারের সাথে মেসেঞ্জারে/হোয়াটসঅ্যাপে শেয়ার করতে পারবেন।",
      ],
    },
    {
      id: "b-5",
      title: "৫. ফটো গ্যালারি ও পোজ রেফারেন্স (Photo Gallery & Poses)",
      icon: FiCamera,
      category: "Photography Reference",
      summary: "ফটোগ্রাফারদের শুটিং নির্দেশনার জন্য রেফারেন্স পোজ আইডিয়ার ক্যাটালগ।",
      steps: [
        "ধাপ ১: 'Photo Gallery' পেজে প্রবেশ করুন।",
        "ধাপ ২: ক্যাটাগরি ফিল্টার থেকে Wedding, Couple, Bride, Groom, Haldi বা Portfolios নির্বাচন করুন।",
        "ধাপ ৩: নতুন কোনো শুট রেফারেন্স ফটো যুক্ত করতে 'Add New Pose Photo' বাটনে ক্লিক করে ছবি আপলোড করুন।",
        "ধাপ ৪: ছবিগুলোতে প্রয়োজনীয় ট্যাগ বা ক্যাটাগরি দিন যাতে ফিল্ড শুটের সময় ফটোগ্রাফাররা দ্রুত খুঁজে পান।",
      ],
    },
    {
      id: "b-6",
      title: "৬. স্টাফ একাউন্ট তৈরি ও এক্সেস কন্ট্রোল (Staff Management)",
      category: "User Access",
      icon: FiUsers,
      summary: "টিম মেম্বারদের জন্য স্বতন্ত্র লগইন আইডি, পাসওয়ার্ড ও এক্সেস পারমিশন তৈরি করা।",
      steps: [
        "ধাপ ১: 'Staffs' মেনুতে গিয়ে 'Add New Staff' বাটনে ক্লিক করুন।",
        "ধাপ ২: স্টাফ মেম্বারের পুরো নাম, মোবাইল নম্বর, পদবি (যেমন: Senior Photographer, Editor) ইনপুট দিন।",
        "ধাপ ৩: স্টাফের জন্য একটি ইউনিক Login ID (যেমন: staff01) এবং প্রাথমিক Password সেট করে দিন।",
        "ধাপ ৪: অ্যাকাউন্ট তৈরি হলে স্টাফ তাদের নিজস্ব আইডি দিয়ে সিস্টেমে লগইন করতে পারবেন।",
        "ধাপ ৫: নিরাপত্তা রক্ষার্থে স্টাফ অ্যাকাউন্ট কেবল ফটো ড্রাইভ, পোজ গ্যালারি এবং স্টাফ লিস্ট দেখতে পারবে। এডমিন ফিনান্স বা সিকিউরিটি পেজে স্টাফদের অ্যাক্সেস সম্পূর্ণ নিষিদ্ধ।",
      ],
      tips: "পরামর্শ: কোনো স্টাফ চাকরি ছেড়ে দিলে স্টাফ লিস্ট থেকে তার এক্সেস সঙ্গে সঙ্গে Deactivate বা Delete করুন।",
    },
    {
      id: "b-7",
      title: "৭. এডমিন প্রোফাইল ও পাসওয়ার্ড পরিবর্তন (Account & Security)",
      category: "Security Settings",
      icon: FiLock,
      summary: "এডমিন নাম আপডেট এবং সিস্টেমে প্রবেশের প্রধান পাসওয়ার্ড পরিবর্তন।",
      steps: [
        "ধাপ ১: 'Change Password' মেনুতে প্রবেশ করুন।",
        "ধাপ ২: এডমিন প্যানেলের শীর্ষে প্রদর্শিত আপনার নাম পরিবর্তন করতে 'Admin Display Name' ফিল্ডে নতুন নাম লিখে সেভ করুন।",
        "ধাপ ৩: সিকিউরিটি পাসওয়ার্ড পরিবর্তন করতে প্রথমে আপনার 'Current Password' ইনপুট দিন।",
        "ধাপ ৪: এরপর একটি নতুন সুরক্ষিত 'New Password' (কমপক্ষে ৬ অক্ষর) এবং 'Confirm Password' টাইপ করুন।",
        "ধাপ ৫: 'Save Account Changes' এ চাপ দিন। পাসওয়ার্ড সফলভাবে পরিবর্তিত হলে নতুন পাসওয়ার্ড দিয়ে পুনরায় লগইন করতে হবে।",
      ],
    },
    {
      id: "b-8",
      title: "৮. সাধারণ সমস্যা ও সমাধান (Troubleshooting & FAQ)",
      category: "Help Desk",
      icon: FiHelpCircle,
      summary: "এডমিন প্যানেল ব্যবহারে সম্ভাব্য সমস্যা ও তার তাৎক্ষণিক সমাধান।",
      steps: [
        "সমস্যা ১: পাসওয়ার্ড ভুলে গেছেন? — সিস্টেম ব্যাকএন্ড ডাটাবেজ থেকে ডিফল্ট এডমিন অ্যাকাউন্ট রিসেট করতে ডেভেলপার সাহারিয়ার (01744218960) এর সাহায্য নিন।",
        "সমস্যা ২: ইনভয়েস PDF ডাউনলোড হচ্ছে না? — আপনার ব্রাউজারে Pop-up Blocker চালু থাকলে তা বন্ধ করুন অথবা Chrome/Edge ব্রাউজারের সর্বশেষ ভার্সন ব্যবহার করুন।",
        "সমস্যা ৩: নতুন স্টাফ লগইন করতে পারছে না? — স্টাফের Login ID বানান সঠিক আছে কিনা এবং Staff Status 'Active' করা আছে কিনা যাচাই করুন।",
      ],
    },
  ];

  // Detailed Staff Manual Sections
  const staffTopics: ManualTopic[] = [
    {
      id: "s-1",
      title: "১. ফটো ড্রাইভ লিংক ব্যবহার (Photo Drive Access)",
      category: "Workflows",
      icon: FiLink,
      summary: "অ্যাসাইন করা ইভেন্টের ছবি ও ভিডিও ড্রাইভ ফাইল খুঁজে পাওয়া ও ব্যবহার করা।",
      steps: [
        "ধাপ ১: এডমিন প্যানেলে আপনার স্টাফ Login ID ও Password দিয়ে লগইন করুন।",
        "ধাপ ২: সাইডবার মেনু থেকে 'Photo Link' অপশনে প্রবেশ করুন।",
        "ধাপ ৩: আপনার দায়িত্বপ্রাপ্ত ইভেন্টের পাশে থাকা ড্রাইভ লিংকে ক্লিক করুন।",
        "ধাপ ৪: ক্লায়েন্টকে লিংক পাঠাতে হলে 'Copy Link' বাটনে চাপ দিয়ে লিংকটি কপি করে নিন।",
      ],
      tips: "নিয়ম: ড্রাইভের যেকোনো ফাইল ডিলিট বা পরিবর্তন করার আগে প্রধান এডমিনের অনুমতি গ্রহণ করুন।",
    },
    {
      id: "s-2",
      title: "২. পোজ গ্যালারি ও শুট রেফারেন্স (Pose Reference Gallery)",
      category: "On-Field Reference",
      icon: FiCamera,
      summary: "শুটিংয়ের সময় দ্রুত পোজ আইডিয়া ও ক্লায়েন্টকে পোজ দেখানোর ক্যাটালগ।",
      steps: [
        "ধাপ ১: ইভেন্ট কাভারেজের সময় মোবাইল বা ট্যাবলেটে প্যানেলের 'Photo Gallery' মেনু ওপেন করুন।",
        "ধাপ ২: Bride, Groom, Couple, Haldi বা Family ফিল্টার বাটনে ক্লিক করুন।",
        "ধাপ ৩: পোজ ফটোতে ক্লিক করে ক্লায়েন্টকে সুন্দর পোজ রেফারেন্স দেখিয়ে সেরা ছবি তুলুন।",
      ],
    },
    {
      id: "s-3",
      title: "৩. স্টাফ তালিকা ও সহকর্মীদের সাথে যোগাযোগ (Team Roster)",
      category: "Communication",
      icon: FiUsers,
      summary: "টিম মেম্বারদের তালিকা ও ইভেন্ট কোঅর্ডিনেশনের তথ্য জানা।",
      steps: [
        "ধাপ ১: 'Staffs' মেনুতে ক্লিক করে আপনার সহকর্মীদের তালিকা দেখুন।",
        "ধাপ ২: ইভেন্ট কাভারেজে যাওয়ার আগে সহকর্মীর ফোন নম্বর ও দায়িত্ব জেনে নিন।",
      ],
    },
    {
      id: "s-4",
      title: "৪. স্টাফ সিকিউরিটি ও অ্যাকাউন্ট নিয়মাবলী (Security Rules)",
      category: "Security",
      icon: FiLock,
      summary: "স্টাফদের লগইন তথ্য সুরক্ষা ও দায়িত্বশীল ব্যবহারের নির্দেশনা।",
      steps: [
        "নিয়ম ১: আপনার নির্দিষ্ট Login ID ও Password সম্পূর্ণ গোপন রাখুন।",
        "নিয়ম ২: পাবলিক বা অন্যের ডিভাইসে লগইন করলে কাজ শেষে অবশ্যই 'Logout' বাটনে ক্লিক করে সাইন আউট করুন।",
        "নিয়ম ৩: এডমিন সংক্রান্ত কোনো তথ্য বা ইনভয়েস সংক্রান্ত বিষয় স্টাফ এক্সেস বহির্ভূত।",
      ],
    },
    {
      id: "s-5",
      title: "৫. কারিগরি সাহায্য (Technical Support)",
      category: "Help",
      icon: FiHelpCircle,
      summary: "প্যানেল ব্যবহারে কোনো অসুবিধা হলে সাহায্য নেওয়ার মাধ্যম।",
      steps: [
        "লগইন সমস্যা বা লিংকে কোনো টেকনিক্যাল ত্রুটি দেখা দিলে সঙ্গে সঙ্গে এডমিনকে অবহিত করুন অথবা পেজের নিচের হোয়াটসঅ্যাপ সাপোর্ট নম্বরে যোগাযোগ করুন।",
      ],
    },
  ];

  const topics = activeTab === "admin" ? adminTopics : staffTopics;

  const filteredTopics = topics.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.steps.some((step) => step.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 lg:py-6">
        {/* Main Header Banner - Clean Dark Design */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-[#0c1017] p-5 sm:p-7 shadow-lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
                <FiBook size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md border border-orange-500/30 bg-orange-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-400">
                    ChitroJaal Official Guide
                  </span>
                  {userRole && (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-neutral-300 capitalize">
                      Your Access: {userRole}
                    </span>
                  )}
                </div>
                <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-white">
                  ব্যবহারকারী নির্দেশিকা (User Manual)
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-neutral-400">
                  চিত্রজাল এডমিন প্যানেল দক্ষতার সাথে ব্যবহারের পূর্ণাঙ্গ বাংলা টিউটোরিয়াল ও গাইডলাইন।
                </p>
              </div>
            </div>
          </div>

          {/* Role Navigation Tabs - Hidden if user is staff (staff only see staff manual) */}
          {userRole === "admin" ? (
            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              <button
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === "admin"
                    ? "border border-orange-500/50 bg-orange-600 text-white"
                    : "border border-white/10 bg-[#141a24] text-neutral-400 hover:text-white"
                }`}
              >
                <FiShield size={16} />
                <span>এডমিন নির্দেশিকা (Admin Manual)</span>
              </button>

              <button
                onClick={() => setActiveTab("staff")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === "staff"
                    ? "border border-orange-500/50 bg-orange-600 text-white"
                    : "border border-white/10 bg-[#141a24] text-neutral-400 hover:text-white"
                }`}
              >
                <FiUsers size={16} />
                <span>স্টাফ নির্দেশিকা (Staff Manual)</span>
              </button>
            </div>
          ) : (
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-bold text-orange-300">
                <FiUsers size={14} />
                <span>স্টাফ ব্যবহারের জন্য নির্দেশিকা (Staff Access Only)</span>
              </div>
            </div>
          )}
        </div>

        {/* Search Filter Bar */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0c1017] px-4 py-3 shadow-sm focus-within:border-orange-500/50">
          <FiSearch className="text-neutral-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নির্দেশিকা খুঁজুন (যেমন: ইনভয়েস, বুকিং, পাসওয়ার্ড, পোজ)..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Topic Accordions */}
        <div className="space-y-3.5">
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-[#0c1017] p-8 text-center text-sm text-neutral-400">
              নির্দেশিকা লোড হচ্ছে...
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#0c1017] p-8 text-center text-sm text-neutral-400">
              আপনার খোঁজা অনুযায়ী কোনো বিষয় পাওয়া যায়নি।
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const Icon = topic.icon;
              const isOpen = Boolean(openSections[topic.id]);

              return (
                <div
                  key={topic.id}
                  className="rounded-xl border border-white/10 bg-[#0c1017] transition-colors"
                >
                  <button
                    onClick={() => toggleSection(topic.id)}
                    className="flex w-full items-center justify-between p-4 sm:p-5 text-left hover:bg-white/[0.02]"
                  >
                    <div className="flex items-start gap-3.5 pr-2">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-400">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white sm:text-lg">
                            {topic.title}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-normal">
                          {topic.summary}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-neutral-400">
                      {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/10 bg-[#070a0f] p-4 sm:p-5">
                      <div className="mb-3 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                        ধাপে ধাপে ব্যবহারের প্রক্রিয়া:
                      </div>
                      <ol className="space-y-2.5">
                        {topic.steps.map((step, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 leading-relaxed"
                          >
                            <FiCheckCircle
                              className="mt-1 shrink-0 text-orange-500"
                              size={15}
                            />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>

                      {topic.tips && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                          <FiAlertCircle className="mt-0.5 shrink-0 text-amber-400" size={16} />
                          <span>{topic.tips}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Developer Support Card — Clean, Solid & Professional */}
        <div className="mt-8 rounded-2xl border border-emerald-500/40 bg-[#0b1411] p-5 sm:p-7 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-400">
                <FiMessageCircle size={26} />
              </div>
              <div>
                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Developer & Technical Assistance
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                  System Created by <span className="text-emerald-400">Sahariar</span>
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-300">
                  সিস্টেমের যেকোনো কারিগরি সুবিধা, পরামর্শ বা জরুরি সহায়তার জন্য সরাসরি হোয়াটসঅ্যাপে বার্তা পাঠান।
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/8801744218960"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-colors hover:bg-emerald-500"
            >
              <FiMessageCircle size={18} />
              <span>WhatsApp: 01744218960</span>
              <FiExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
