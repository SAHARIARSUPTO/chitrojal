"use client";

import React, { useState, useRef } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiEye,
  FiTag,
  FiHeart,
  FiImage,
  FiUploadCloud,
  FiX,
  FiFilter,
} from "react-icons/fi";

const poses = [
  {
    id: "1",
    name: "Classic Bride & Groom",
    category: "Wedding",
    images: 8,
    likes: 142,
    created: "15 Jan, 2024",
  },
  {
    id: "2",
    name: "Candid Laughing Moment",
    category: "Wedding",
    images: 6,
    likes: 98,
    created: "20 Jan, 2024",
  },
  {
    id: "3",
    name: "Family Group Standing",
    category: "Family",
    images: 12,
    likes: 67,
    created: "25 Jan, 2024",
  },
  {
    id: "4",
    name: "Corporate Headshot",
    category: "Corporate",
    images: 5,
    likes: 45,
    created: "01 Feb, 2024",
  },
  {
    id: "5",
    name: "Engagement Ring Focus",
    category: "Engagement",
    images: 4,
    likes: 156,
    created: "05 Feb, 2024",
  },
  {
    id: "6",
    name: "Kid Playing & Laughing",
    category: "Children",
    images: 10,
    likes: 201,
    created: "10 Feb, 2024",
  },
];

const categoryColors: { [key: string]: string } = {
  Wedding: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Engagement: "bg-red-500/10 text-red-400 border-red-500/20",
  Family: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Corporate: "bg-white/5 text-neutral-300 border-white/10",
  Children: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function PosesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; preview: string; }[]>([]);
  const inputRef = useRef(null);

  const filteredPoses = poses.filter(
    (pose) =>
      pose.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || pose.category === selectedCategory),
  );

  const categories = [...new Set(poses.map((p) => p.category))];

  // Drag and Drop Handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      preview: URL.createObjectURL(file), // For real apps, clean this up with URL.revokeObjectURL
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((files) =>
      files.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiImage className="text-orange-500" /> Pose Library
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Curate, manage, and reference photography poses and mood boards
              for your shoots.
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto"
          >
            <FiPlus size={18} /> Add Collection
          </button>
        </div>

        {/* Stats Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Collections", value: "6", icon: FiImage },
            { label: "Total Images", value: "45", icon: FiUploadCloud },
            { label: "Total Saved/Likes", value: "709", icon: FiHeart },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <stat.icon size={64} className="text-orange-500" />
              </div>
              <div className="relative z-10">
                <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                  {stat.label}
                </h3>
                <p className="text-3xl font-black text-white drop-shadow-sm">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[1.5rem]"></div>

          <div className="flex flex-col lg:flex-row gap-4 relative z-10">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            <div className="relative w-full lg:w-64">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.2em 1.2em",
                }}
              >
                <option value="" className="bg-[#0A0A0A]">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0A0A0A]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Poses Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoses.map((pose) => (
            <div
              key={pose.id}
              className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(234,88,12,0.1)] transition-all duration-300 group"
            >
              {/* Image Placeholder / Banner */}
              <div className="h-48 relative overflow-hidden bg-neutral-900 border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10"></div>

                {/* Simulated Image Count Overlay */}
                <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 text-xs font-bold text-white shadow-lg">
                  <FiImage className="text-orange-500" /> {pose.images}
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                  <FiImage
                    size={48}
                    className="text-neutral-500 group-hover:text-orange-500/50"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-20">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-orange-400 transition-colors">
                    {pose.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${categoryColors[pose.category] || "bg-white/5 text-white border-white/10"}`}
                  >
                    <FiTag size={12} /> {pose.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 mb-6 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors cursor-pointer">
                    <FiHeart className="text-red-500" /> {pose.likes} Saves
                  </span>
                  <span>{pose.created}</span>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/50 text-white text-sm font-bold transition-all">
                    <FiEye size={16} /> View
                  </button>
                  <button
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-neutral-400 hover:text-red-500 transition-all"
                    title="Delete Collection"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPoses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 relative z-10 text-center px-4 bg-[#0A0A0A]/50 rounded-[2rem] border border-white/5">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FiImage className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No collections found
            </h3>
            <p className="text-neutral-400">
              Adjust your search or add a new pose collection.
            </p>
          </div>
        )}
      </div>

      {/* Modern Image Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsUploadOpen(false)}
          ></div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiUploadCloud className="text-orange-500" /> Add Pose
                Collection
              </h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              {/* Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Collection Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunset Bridal Portraits"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Category
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none cursor-pointer">
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Upload Images
                </label>
                <div
                  className={`relative w-full border-2 border-dashed rounded-[1.5rem] p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-orange-500 bg-orange-500/5"
                      : "border-white/10 bg-[#050505] hover:border-white/20 hover:bg-white/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <FiUploadCloud
                        size={32}
                        className={
                          dragActive ? "text-orange-500" : "text-neutral-400"
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">
                        Drag & drop high-res images here
                      </p>
                      <p className="text-xs text-neutral-500">
                        or click to browse your files (JPEG, PNG, WEBP)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Selected Files ({uploadedFiles.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square bg-[#050505]"
                      >
                        <img
                          src={file.preview}
                          alt="preview"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-[10px] text-white truncate font-medium">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-orange-400">
                            {file.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all transform scale-90 hover:scale-100"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-3">
              <button
                onClick={() => setIsUploadOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <FiUploadCloud /> Save Collection
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
