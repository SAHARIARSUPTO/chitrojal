"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiSearch,
  FiPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiFilter,
  FiUserCheck,
  FiUserMinus,
} from "react-icons/fi";

// Cohesive, "no blue" premium palette for roles
const roleConfig: { [key: string]: string } = {
  "Senior Photographer": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Photographer: "text-neutral-200 bg-white/5 border-white/10",
  "Video Editor": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "Photo Editor": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Assistant Photographer":
    "text-neutral-400 bg-neutral-500/10 border-neutral-500/20",
};

// Cohesive status palette
const statusConfig: { [key: string]: string } = {
  Active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "On Leave": "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Inactive: "text-red-400 bg-red-400/10 border-red-400/20",
};

interface StaffMember {
  name: string;
  email: string;
  role: string;
  phone: string;
  joinDate: string;
  assignments: number;
  status: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/staff");
        const data = await response.json();
        if (data.success) setStaff(data.data);
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Enhanced filtering logic
  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "All Roles" || member.role === roleFilter;
    const matchesStatus =
      statusFilter === "All Status" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Dynamic Stats calculations based on fetched data
  const activeCount = staff.filter((s) => s.status === "Active").length;
  const onLeaveCount = staff.filter((s) => s.status === "On Leave").length;
  const activePercentage =
    staff.length > 0 ? Math.round((activeCount / staff.length) * 100) : 0;
  const totalAssignments = staff.reduce(
    (sum, s) => sum + (Number(s.assignments) || 0),
    0,
  );

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiUsers className="text-orange-500" /> Staff Management
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Manage your studio team members, track their roles, statuses, and
              current assignments.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto">
            <FiPlus size={18} /> Add Staff Member
          </button>
        </div>

        {/* Staff Stats Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Staff */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-white/5 border-white/10 text-white shadow-inner">
                <FiUsers size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                Total Staff
              </h3>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 mb-2 drop-shadow-sm">
                {isLoading ? "—" : staff.length}
              </p>
              <div className="flex items-center text-xs font-semibold text-emerald-400 gap-1.5">
                <FiUserCheck size={14} /> {activePercentage}% Active
              </div>
            </div>
          </div>

          {/* Active Assignments */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-inner">
                <FiBriefcase size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                Active Assignments
              </h3>
              <p className="text-3xl font-black text-orange-400 mb-2 drop-shadow-sm">
                {isLoading ? "—" : totalAssignments}
              </p>
              <div className="flex items-center text-xs font-semibold text-orange-500/80">
                Currently distributed
              </div>
            </div>
          </div>

          {/* On Leave */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-inner">
                <FiUserMinus size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                On Leave
              </h3>
              <p className="text-3xl font-black text-amber-400 mb-2 drop-shadow-sm">
                {isLoading ? "—" : onLeaveCount}
              </p>
              <div className="flex items-center text-xs font-semibold text-amber-500/80 gap-1.5">
                <FiCalendar size={14} />{" "}
                {onLeaveCount > 0 ? "Members unavailable" : "Fully staffed"}
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[1.5rem]"></div>

          <div className="flex flex-col lg:flex-row gap-4 relative z-10">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
              <div className="relative flex-1 sm:w-56">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.2em 1.2em",
                  }}
                >
                  <option className="bg-[#0A0A0A]">All Roles</option>
                  <option className="bg-[#0A0A0A]">Senior Photographer</option>
                  <option className="bg-[#0A0A0A]">Photographer</option>
                  <option className="bg-[#0A0A0A]">Photo Editor</option>
                  <option className="bg-[#0A0A0A]">Video Editor</option>
                  <option className="bg-[#0A0A0A]">
                    Assistant Photographer
                  </option>
                </select>
              </div>
              <div className="relative flex-1 sm:w-48">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.2em 1.2em",
                  }}
                >
                  <option className="bg-[#0A0A0A]">All Status</option>
                  <option className="bg-[#0A0A0A]">Active</option>
                  <option className="bg-[#0A0A0A]">On Leave</option>
                  <option className="bg-[#0A0A0A]">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

          {isLoading ? (
            // Skeleton Loading State
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl animate-pulse"
                >
                  <div className="flex items-center gap-4 w-1/3">
                    <div className="w-10 h-10 rounded-full bg-white/5"></div>
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-white/10 rounded w-1/2"></div>
                      <div className="h-3 bg-white/5 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="w-24 h-6 bg-white/5 rounded-lg"></div>
                  <div className="w-24 h-6 bg-white/5 rounded-lg"></div>
                  <div className="w-1/4 h-4 bg-white/5 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredStaff.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-32 space-y-4 relative z-10 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <FiUsers className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white">No staff found</h3>
              <p className="text-neutral-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            // Custom Styled Table
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-5 pl-6">Name & Email</th>
                    <th className="p-5">Role</th>
                    <th className="p-5">Contact Details</th>
                    <th className="p-5">Join Date</th>
                    <th className="p-5 text-center">Assignments</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStaff.map((person, index) => (
                    <tr
                      key={index}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5 pl-6">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors">
                          {person.name}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-medium">
                          {person.email}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${roleConfig[person.role] || "bg-white/5 text-white border-white/10"}`}
                        >
                          {person.role}
                        </span>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {person.phone}
                      </td>
                      <td className="p-5 text-neutral-400 font-medium">
                        {new Date(person.joinDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-5 text-center font-bold text-white">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#050505] border border-white/10 shadow-inner">
                          {person.assignments}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${statusConfig[person.status] || statusConfig["Inactive"]}`}
                        >
                          {person.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="View Profile"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="Edit Staff"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="Email Staff"
                          >
                            <FiMail className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-lg transition-all"
                            title="Remove Staff"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
