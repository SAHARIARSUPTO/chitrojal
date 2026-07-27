/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiPlus,
  FiFolder,
  FiX,
  FiImage,
  FiUploadCloud,
  FiSearch,
  FiEye,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

function PoseCard({
  pose,
  onOpenView,
  onDelete,
  canDelete,
}: {
  pose: any;
  onOpenView: (pose: any) => void;
  onDelete: (poseId: string) => void;
  canDelete: boolean;
}) {
  return (
    <div
      className="relative group rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0A0A0A] shadow-lg aspect-square"
      onClick={() => onOpenView(pose)}
    >
      <Image
        src={pose.imageUrls[0]}
        alt={pose.name}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="p-2 rounded-lg bg-black/50 hover:bg-white/20 text-white transition-colors">
              <FiEye size={16} />
            </button>
            {canDelete ? (
              <button
                onClick={() => onDelete(pose._id)}
                className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            ) : null}
          </div>
        </div>
        <div className="text-white">
          <h3 className="font-bold text-sm truncate">{pose.name}</h3>
          <div className="flex items-center gap-4 text-xs text-neutral-400 mt-1">
            <div className="flex items-center gap-1.5">
              <FiImage size={12} />
              <span>{pose.imageUrls.length} Photos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from "framer-motion";

const FullscreenImageViewer = ({
  isOpen,
  images,
  onClose,
}: {
  isOpen: boolean;
  images: string[];
  onClose: () => void;
}) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const imageIndex = wrap(0, images.length, page);

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-4">
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#050505] border border-white/10 flex justify-center items-center"
          style={{ aspectRatio: "16/9" }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={page} // Use page as key to trigger re-render on paginate
              src={images[imageIndex]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute w-full h-full object-contain"
            />
          </AnimatePresence>
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/50 hover:bg-white/20 text-white transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
                <button
                  onClick={() => paginate(-1)}
                  className="p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                >
                  <FiChevronLeft size={24} />
                </button>
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
                <button
                  onClick={() => paginate(1)}
                  className="p-3 rounded-full bg-black/50 hover:bg-white/20 text-white transition-colors"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const newDirection = i > imageIndex ? 1 : -1;
                  setPage([i, newDirection]);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === imageIndex ? "bg-white" : "bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function PosesPage() {
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const { showSuccess, showError } = useNotification();
  const [poses, setPoses] = useState<any[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPose, setSelectedPose] = useState<any | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPoses, setFilteredPoses] = useState<any[]>([]);
  const [totalImages, setTotalImages] = useState(0);
  const [canManagePoses, setCanManagePoses] = useState(false);

  useEffect(() => {
    const filtered = poses.filter((pose) =>
      pose.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredPoses(filtered);
    const total = filtered.reduce(
      (acc, pose) => acc + pose.imageUrls.length,
      0,
    );
    setTotalImages(total);
  }, [poses, searchTerm]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          setCanManagePoses(false);
          return;
        }

        const result = await response.json();
        setCanManagePoses(result?.user?.accessRole === "admin");
      } catch {
        setCanManagePoses(false);
      }
    };

    loadSession();
  }, []);

  async function fetchPoses(folderId: string) {
    setLoading(true);
    try {
      const response = await fetch(`/api/poses?folderId=${folderId}`);
      if (response.ok) {
        const data = await response.json();
        setPoses(data);
      } else {
        showError("Failed to fetch poses.");
      }
    } catch (error) {
      console.error("Error fetching poses:", error);
      showError("Error fetching poses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedFolder) {
      fetchPoses(selectedFolder._id);
    } else {
      setPoses([]);
    }
  }, [selectedFolder]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const openViewModal = (pose: any) => {
    setSelectedPose(pose);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setSelectedPose(null);
  };

  const handleDelete = async (poseId: string) => {
    if (!canManagePoses) {
      showError("Only admin accounts can delete pose collections.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this collection?"))
      return;

    try {
      const response = await fetch(`/api/poses/${poseId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        showSuccess("Collection deleted successfully.");
        if (selectedFolder) {
          fetchPoses(selectedFolder._id);
        }
      } else {
        showError("Failed to delete collection.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      showError("An unexpected error occurred while deleting.");
    }
  };

  const handleSaveCollection = async () => {
    if (!canManagePoses) {
      showError("Only admin accounts can upload pose collections.");
      return;
    }
    if (!selectedFolder) {
      showError("Please select a folder first.");
      return;
    }
    setIsUploading(true);
    try {
      const uploadPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }
        return uploadResponse.json();
      });

      const uploadResults = await Promise.all(uploadPromises);
      const urls = uploadResults.map((result) => result.secure_url);

      const poseData = {
        name: `Collection ${new Date().getTime()}`,
        imageUrls: urls,
        folderId: selectedFolder._id,
      };

      const saveResponse = await fetch("/api/poses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(poseData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save collection.");
      }

      showSuccess("Collection saved successfully!");
      setIsUploadOpen(false);
      setUploadedFiles([]);
      fetchPoses(selectedFolder._id);
    } catch (error) {
      console.error("Error saving collection:", error);
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError("An unknown error occurred during the save process.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  async function fetchFolders() {
    setLoading(true);
    try {
      const response = await fetch("/api/folders");
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        showError("Failed to fetch folders.");
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
      showError("Error fetching folders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!canManagePoses) {
      showError("Only admin accounts can create folders.");
      return;
    }
    if (!newFolderName.trim()) {
      showError("Folder name cannot be empty.");
      return;
    }
    setCreatingFolder(true);
    try {
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });

      if (response.ok) {
        showSuccess("Folder created successfully!");
        setNewFolderName("");
        setIsCreateFolderModalOpen(false);
        fetchFolders(); // Refresh folders
      } else {
        const errorData = await response.json();
        showError(errorData.error || "Failed to create folder.");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      showError("An unexpected error occurred while creating folder.");
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiImage className="text-orange-500" /> Pose Library
            </h1>
            <p className="text-neutral-400 mt-2 text-xs sm:text-sm max-w-md leading-relaxed">
              Curate, manage, and reference photography poses and mood boards
              for your shoots.
            </p>
            {!canManagePoses ? (
              <p className="mt-3 inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Read-only for staff
              </p>
            ) : null}
          </div>
          {selectedFolder ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setSelectedFolder(null)}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
              >
                Back to Folders
              </button>
              {canManagePoses ? (
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto"
                >
                  <FiPlus size={18} /> Upload Poses
                </button>
              ) : null}
            </div>
          ) : (
            canManagePoses ? (
              <button
                onClick={() => setIsCreateFolderModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto"
              >
                <FiFolder size={18} /> Create Folder
              </button>
            ) : null
          )}
        </div>

        {selectedFolder ? (
          <>
            {/* Stats Grid */}

            {/* Filters & Search Toolbar */}
            <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[1.5rem]"></div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex-1 relative group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                  <FiImage className="text-orange-500" />
                  <span className="text-white font-bold">{totalImages}</span>
                  <span className="text-neutral-400 text-sm">images</span>
                </div>
              </div>
            </div>
            {/* Poses view */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] aspect-square animate-pulse"
                  ></div>
                ))
              ) : filteredPoses.length > 0 ? (
                filteredPoses.map((pose) => (
                  <PoseCard
                    key={pose._id}
                    pose={pose}
                    onOpenView={openViewModal}
                    onDelete={handleDelete}
                    canDelete={canManagePoses}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 relative z-10 text-center px-4 bg-[#0A0A0A]/50 rounded-[2rem] border border-white/5 col-span-full">
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
          </>
        ) : (
          <>
            {/* Folders view */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-6 h-[88px] animate-pulse"
                  ></div>
                ))
              ) : folders.length > 0 ? (
                folders.map((folder) => (
                  <div
                    key={folder._id}
                    onClick={() => setSelectedFolder(folder)}
                    className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <FiFolder className="text-orange-500" size={24} />
                      <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors">
                        {folder.name}
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 relative z-10 text-center px-4 bg-[#0A0A0A]/50 rounded-[2rem] border border-white/5 col-span-full">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <FiFolder className="w-8 h-8 text-neutral-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No folders found
                  </h3>
                  <p className="text-neutral-400">
                    Create a folder to get started.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isCreateFolderModalOpen && (
        // Create folder modal JSX
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCreateFolderModalOpen(false)}
          ></div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FiFolder className="text-orange-500" /> Create New Folder
              </h2>
              <button
                onClick={() => setIsCreateFolderModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Folder Name
              </label>
              <input
                type="text"
                placeholder="e.g. Wedding Poses"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-3">
              <button
                onClick={() => setIsCreateFolderModalOpen(false)}
                disabled={creatingFolder}
                className="px-6 py-2.5 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={creatingFolder || !newFolderName}
                className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingFolder ? (
                  "Creating..."
                ) : (
                  <>
                    {" "}
                    <FiPlus /> Create Folder
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsUploadOpen(false)}
          ></div>

          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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

            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
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
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          onLoad={(e) =>
                            URL.revokeObjectURL(
                              (e.target as HTMLImageElement).src,
                            )
                          }
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <p className="text-[10px] text-white truncate font-medium">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-orange-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
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

            <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-3">
              <button
                onClick={() => setIsUploadOpen(false)}
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCollection}
                disabled={isUploading || uploadedFiles.length === 0}
                className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <FiUploadCloud /> Save Collection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPose && (
        <FullscreenImageViewer
          isOpen={isViewOpen}
          images={selectedPose.imageUrls}
          onClose={closeViewModal}
        />
      )}
    </AdminLayout>
  );
}
