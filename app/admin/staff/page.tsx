"use client";

/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import { FiPlus, FiUser, FiX, FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";

interface StaffMember {
  id: string;
  name: string;
  loginId?: string;
  accessRole?: "admin" | "staff";
  contact: string;
  address: string;
  joiningDate: string;
  salary: string;
  eventsCovered: number;
}

export default function StaffPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: "",
    loginId: "",
    password: "",
    contact: "",
    address: "",
    joiningDate: "",
    salary: "",
    eventsCovered: "",
  });
  const { showSuccess, showError } = useNotification();

  const isAdmin = userRole === "admin";

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUserRole(userData.user?.accessRole);
        }
      } catch (error) {
        console.error("Failed to fetch user role", error);
      }
    };
    fetchUserRole();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/staff");
      const result = await response.json();
      if (response.ok) {
        setStaffList(
          (result.data || []).map((item: any) => ({
            id: item._id,
            name: item.name || "",
            loginId: item.loginId || "",
            accessRole: item.accessRole || "staff",
            contact: item.contact || "",
            address: item.address || "",
            joiningDate: item.joiningDate || "",
            salary: item.salary || "",
            eventsCovered: item.eventsCovered || 0,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewStaff({
      name: "",
      loginId: "",
      password: "",
      contact: "",
      address: "",
      joiningDate: "",
      salary: "",
      eventsCovered: "",
    });
    setEditingStaff(null);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!newStaff.name || !newStaff.loginId || !newStaff.joiningDate) {
      showError("Please fill all required fields.");
      return;
    }

    if (!editingStaff && !newStaff.password) {
      showError("Password is required for new staff accounts.");
      return;
    }

    try {
      const response = await fetch(
        editingStaff
          ? `/api/admin/staff/${editingStaff.id}`
          : "/api/admin/staff",
        {
          method: editingStaff ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newStaff,
            eventsCovered: Number(newStaff.eventsCovered) || 0,
            salary: newStaff.salary || "",
            password: newStaff.password || undefined,
          }),
        },
      );
      if (response.ok) {
        showSuccess(
          editingStaff
            ? "Staff updated successfully!"
            : "Staff member added successfully!",
        );
        setIsModalOpen(false);
        resetForm();
        fetchStaff();
      } else {
        showError("Could not save staff member.");
      }
    } catch (error) {
      console.error(error);
      showError("Unexpected error");
    }
  };

  const handleEdit = (staff: StaffMember) => {
    if (!isAdmin) return;
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name || "",
      loginId: staff.loginId || "",
      password: "",
      contact: staff.contact || "",
      address: staff.address || "",
      joiningDate: staff.joiningDate
        ? new Date(staff.joiningDate).toISOString().split("T")[0]
        : "",
      salary: staff.salary || "",
      eventsCovered: String(staff.eventsCovered || 0),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this staff member?")) return;
    try {
      const response = await fetch(`/api/admin/staff/${staffId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchStaff();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 text-neutral-200 p-4">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiUsers className="text-orange-500" /> Staff Management
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              {isAdmin
                ? "Add, view, and manage your studio's staff members."
                : "View your studio's staff members."}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto"
            >
              <FiPlus size={16} /> Add New Staff
            </button>
          )}
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-4 grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-[#050505] p-4 animate-pulse">
                  <div className="h-4 w-32 bg-neutral-700 rounded mb-3" />
                  <div className="h-3 w-48 bg-neutral-800 rounded mb-2" />
                  <div className="h-3 w-40 bg-neutral-800 rounded" />
                </div>
              ))}
            </div>
          ) : staffList.length > 0 ? (
            <div className="grid gap-3 p-4">
              {staffList.map((staff) => (
                <div
                  key={staff.id}
                  className="rounded-xl border border-white/5 bg-[#050505] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm sm:text-base truncate">
                        {staff.name}
                      </div>
                      <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 break-all">
                        {staff.address || "N/A"}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
                      {staff.accessRole || "staff"}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Login ID</p>
                      <p className="text-neutral-200 mt-1 break-all">{staff.loginId || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Contact</p>
                      <p className="text-neutral-200 mt-1 break-all">{staff.contact || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Joining Date</p>
                      <p className="text-neutral-200 mt-1">{staff.joiningDate || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Salary</p>
                      <p className="text-neutral-200 mt-1">{staff.salary ? `৳${staff.salary}` : "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">Events</p>
                      <p className="text-neutral-200 mt-1">{staff.eventsCovered}</p>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="p-2 rounded-lg bg-black/50 hover:bg-white/20 text-white transition-colors"
                      >
                        <FiEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
                        className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-neutral-500">
              No staff members found.
              {isAdmin && " Add one to get started."}
            </div>
          )}
        </div>
        {isAdmin && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#050505]">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiUser className="text-orange-500" />{" "}
                  {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleAddStaff}>
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newStaff.name || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Login ID*
                      </label>
                      <input
                        type="text"
                        name="loginId"
                        value={newStaff.loginId || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                        placeholder="staff01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Password{editingStaff ? " (optional)" : "*"}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={newStaff.password || ""}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      placeholder={
                        editingStaff
                          ? "Leave blank to keep current password"
                          : "Set a password"
                      }
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Contact Number*
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={newStaff.contact || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Joining Date*
                      </label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={newStaff.joiningDate || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newStaff.address || ""}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      placeholder="123 Main St, Dhaka"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Salary (BDT)
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={newStaff.salary || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Events Covered (Optional)
                      </label>
                      <input
                        type="number"
                        name="eventsCovered"
                        value={newStaff.eventsCovered || ""}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-end gap-3 border-t border-white/5 bg-[#050505]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiPlus /> {editingStaff ? "Update Staff" : "Add Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
