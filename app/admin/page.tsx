"use client";

import React from "react";
import AdminLayout from "../components/home/AdminLayout";
import {
  FiCamera,
  FiCalendar,
  FiHardDrive,
  FiImage,
  FiMoreVertical,
  FiVideo,
  FiMapPin,
  FiCheckCircle,
  FiTrendingUp,
  FiDollarSign,
  FiUploadCloud,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import { MdOutlineEditNote } from "react-icons/md";

// Contextual Mock Data for a Photography Studio
const activeProjects = [
  {
    id: "PRJ-1042",
    client: "Anika & Rifat Wedding",
    package: "Premium Cinematic",
    deliverables: "1000+ Photos, 20m Film",
    deadline: "2024-03-05",
    status: "Editing",
    amount: "৳45,000",
  },
  {
    id: "PRJ-1043",
    client: "TechCorp Product Launch",
    package: "Standard Corporate",
    deliverables: "200 Edited Photos, Reels",
    deadline: "2024-02-28",
    status: "Color Grading",
    amount: "৳15,000",
  },
  {
    id: "PRJ-1044",
    client: "Sarah's Holud",
    package: "Basic Event",
    deliverables: "500+ Photos",
    deadline: "2024-02-25",
    status: "Raw Transfer",
    amount: "৳10,000",
  },
  {
    id: "PRJ-1045",
    client: "Lumina Fashion Shoot",
    package: "Commercial Portfolio",
    deliverables: "50 Retouched Output",
    deadline: "2024-03-10",
    status: "Pending Details",
    amount: "৳25,000",
  },
];

const upcomingSchedules = [
  {
    id: "1",
    event: "Mehendi Ceremony - Zahra",
    date: "Tomorrow, 06:00 PM",
    location: "Radisson Blu, Dhaka",
    gear: "Sony A7IV, 35mm 1.4, Godox V1",
    crew: "Supto, Rafi",
    type: "Photo & Video",
  },
  {
    id: "2",
    event: "Pre-Wedding Outdoor",
    date: "Feb 27, 07:00 AM",
    location: "Cox's Bazar Beach",
    gear: "DJI Mavic 3, Sony FX3, 24-70mm",
    crew: "Supto, Nayeem (Drone)",
    type: "Cinematography",
  },
  {
    id: "3",
    event: "Corporate Profile Shoot",
    date: "Mar 01, 10:00 AM",
    location: "Gulshan Avenue, Block C",
    gear: "Canon R5, 85mm 1.2, Studio Strobes",
    crew: "Supto",
    type: "Portrait",
  },
];

// Swapped out blue/purple for strict warm, neutral, and green tones
const statusConfig: { [key: string]: string } = {
  Editing: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Color Grading": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "Raw Transfer": "text-neutral-300 bg-white/10 border-white/20",
  "Pending Details": "text-neutral-500 bg-black/50 border-white/10",
  Delivered: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export default function DashboardPage() {
  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Studio Background Glows (Inside Admin Area) */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight">
              Studio Overview
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Manage your upcoming shoots, track your post-production pipeline,
              and monitor studio analytics.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-inner">
              <FiUploadCloud className="text-orange-500" size={16} /> Upload
              Assets
            </button>
            <button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none">
              <FiPlus size={16} /> New Booking
            </button>
          </div>
        </div>

        {/* Premium Studio Metrics Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Active Projects",
              value: "14",
              icon: FiCamera,
              trend: "+2 this week",
              trendUp: true,
            },
            {
              label: "Revenue (Monthly)",
              value: "৳1,85,000",
              icon: FiDollarSign,
              trend: "+12.5% vs last month",
              trendUp: true,
            },
            {
              label: "Photos Delivered",
              value: "4,250",
              icon: FiImage,
              trend: "8 galleries sent",
              trendUp: true,
            },
            {
              label: "Cloud Storage",
              value: "3.2 TB",
              icon: FiHardDrive,
              trend: "68% of 5TB used",
              trendUp: false,
              alert: true,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
            >
              {/* Card Inner Gloss */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>

              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <stat.icon size={64} className="text-orange-500" />
              </div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-white/5 rounded-xl text-orange-500 border border-white/10 group-hover:bg-orange-500/10 transition-colors shadow-inner">
                  <stat.icon size={20} />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 mb-3 drop-shadow-sm">
                  {stat.value}
                </p>
                <div
                  className={`flex items-center text-xs font-semibold ${stat.alert ? "text-orange-500" : "text-neutral-500"}`}
                >
                  {stat.trendUp && !stat.alert && (
                    <FiTrendingUp className="mr-1.5" />
                  )}
                  {stat.trend}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          {/* Post-Production Pipeline (Takes up 2/3 width) */}
          <div className="lg:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

            <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <MdOutlineEditNote className="text-orange-500 text-xl" />
                  </div>
                  Post-Production Pipeline
                </h2>
              </div>
              <button className="text-sm font-semibold text-neutral-400 hover:text-orange-400 transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#050505]/50 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
                    <th className="p-5">Project / Client</th>
                    <th className="p-5">Deliverables</th>
                    <th className="p-5">Due Date</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors">
                          {project.client}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-medium">
                          {project.id} • {project.package}
                        </div>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {project.deliverables}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-neutral-300 font-medium">
                          <FiClock className="text-orange-500" />
                          {project.deadline}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig[project.status] || statusConfig["Pending Details"]}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="p-5 text-right font-bold text-white">
                        {project.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shooting Schedule & Logistics (Takes up 1/3 width) */}
          <div className="lg:col-span-1 space-y-8">
            {/* Schedule Card */}
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

              <div className="p-6 border-b border-white/5 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <FiCalendar className="text-orange-500" />
                  </div>
                  Upcoming Shoots
                </h2>
              </div>

              <div className="p-6 space-y-6 relative z-10">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="relative pl-5 border-l-2 border-white/10 hover:border-orange-500 transition-colors group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-[#050505] border-2 border-neutral-700 group-hover:border-orange-500 transition-colors"></div>

                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="font-bold text-white text-sm">
                        {schedule.event}
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                        {schedule.type}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-neutral-400 mb-3 flex items-center gap-2">
                      <FiClock className="text-orange-500/70" /> {schedule.date}
                    </div>

                    <div className="bg-[#050505] rounded-xl p-3.5 border border-white/5 space-y-2.5 shadow-inner">
                      <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <FiMapPin className="text-orange-500 mt-0.5 shrink-0" />
                        <span className="truncate font-medium">
                          {schedule.location}
                        </span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <FiVideo className="text-orange-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1 font-medium">
                          {schedule.gear}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Alert Mini-Widget */}
            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-orange-500/30 rounded-[2rem] p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,88,12,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <FiHardDrive className="text-orange-500" /> NAS Storage Sync
                </h3>
                <span className="text-orange-500 text-sm font-black">68%</span>
              </div>

              <div className="w-full bg-[#050505] rounded-full h-2 mb-4 border border-white/5 relative z-10 shadow-inner">
                <div
                  className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                  style={{ width: "68%" }}
                ></div>
              </div>

              <p className="text-xs text-neutral-400 font-medium flex items-center gap-2 relative z-10">
                <FiCheckCircle className="text-orange-500" /> All raw files from
                yesterday backed up successfully.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
