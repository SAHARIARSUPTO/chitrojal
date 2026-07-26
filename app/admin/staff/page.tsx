"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import { FiPlus, FiUser, FiX, FiUsers, FiEdit, FiTrash2 } from "react-icons/fi";
import { useNotification } from "@/hooks/useNotification";

interface StaffMember {
  id: string;
  name: string;
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
  const [newStaff, setNewStaff] = useState({
    name: "",
    contact: "",
    address: "",
    joiningDate: "",
    salary: "",
    eventsCovered: "",
  });
  const { showSuccess, showError } = useNotification();

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/staff");
      const result = await response.json();
      if (response.ok) {
        setStaffList(
          (result.data || []).map((item: any) => ({
            id: item._id,
            name: item.name,
            contact: item.contact,
            address: item.address,
            joiningDate: item.joiningDate,
            salary: item.salary,
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
    if (!newStaff.name || !newStaff.contact || !newStaff.joiningDate) {
      showError("Please fill all required fields.");
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
    setEditingStaff(staff);
    setNewStaff({
      name: staff.name,
      contact: staff.contact,
      address: staff.address,
      joiningDate: staff.joiningDate,
      salary: staff.salary,
      eventsCovered: String(staff.eventsCovered || 0),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (staffId: string) => {
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
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiUsers className="text-orange-500" /> Staff Management
            </h1>
            <p className="text-neutral-400 mt-2 text-xs sm:text-sm max-w-md leading-relaxed">
              Add, view, and manage your studio's staff members.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto"
          >
            <FiPlus size={18} /> Add New Staff
          </button>
        </div>

        {/* Staff Table */}
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#050505]/50 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
                <tr>
                  <th className="p-5">Name</th>
                  <th className="p-5 hidden md:table-cell">Contact</th>
                  <th className="p-5 hidden lg:table-cell">Joining Date</th>
                  <th className="p-5 hidden md:table-cell">Salary</th>
                  <th className="p-5">Events</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-5">
                        <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
                        <div className="h-3 bg-neutral-800 rounded w-1/2 mt-2"></div>
                      </td>
                      <td className="p-5 hidden md:table-cell">
                        <div className="h-4 bg-neutral-700 rounded w-2/3"></div>
                      </td>
                      <td className="p-5 hidden lg:table-cell">
                        <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
                      </td>
                      <td className="p-5 hidden md:table-cell">
                        <div className="h-4 bg-neutral-700 rounded w-1/3"></div>
                      </td>
                      <td className="p-5">
                        <div className="h-4 bg-neutral-700 rounded w-1/4"></div>
                      </td>
                      <td className="p-5"></td>
                    </tr>
                  ))
                ) : staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5">
                        <div className="font-bold text-white">{staff.name}</div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {staff.address}
                        </div>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium hidden md:table-cell">
                        {staff.contact}
                      </td>
                      <td className="p-5 text-neutral-300 hidden lg:table-cell">
                        {staff.joiningDate}
                      </td>
                      <td className="p-5 text-neutral-300 font-medium hidden md:table-cell">
                        {staff.salary ? `৳${staff.salary}` : "N/A"}
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {staff.eventsCovered}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(staff)}
                            className="p-2 rounded-lg bg-black/50 hover:bg-white/20 text-white transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(staff.id)}
                            className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center p-10 text-neutral-500"
                    >
                      No staff members found. Add one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#050505]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
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
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newStaff.name}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Contact Number*
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={newStaff.contact}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      placeholder="01XXXXXXXXX"
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
                    value={newStaff.address}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    placeholder="123 Main St, Dhaka"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Joining Date*
                    </label>
                    <input
                      type="date"
                      name="joiningDate"
                      value={newStaff.joiningDate}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                      Salary (BDT)
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={newStaff.salary}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                      placeholder="25000"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Events Covered (Optional)
                  </label>
                  <input
                    type="number"
                    name="eventsCovered"
                    value={newStaff.eventsCovered}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-3 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <FiPlus /> {editingStaff ? "Update Staff" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
