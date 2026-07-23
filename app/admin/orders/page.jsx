"use client";

import React, { useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiSearch,
  FiFilter,
  FiShoppingBag,
  FiMapPin,
  FiPhone,
  FiFileText,
  FiCheck,
  FiX,
  FiEye,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

// Mock Data for Photography Studio Orders
const ordersData = [
  {
    id: "ORD-2026-089",
    customer: "Ayesha & Fahim",
    phone: "+880 1711-000001",
    email: "ayesha.f@email.com",
    location: "Radisson Blu, Dhaka",
    packageType: "Premium Wedding",
    amount: 250000,
    date: "2026-08-15",
    status: "Accepted",
    notes:
      "Requires drone coverage for outdoor reception. Two senior photographers requested.",
  },
  {
    id: "ORD-2026-090",
    customer: "TechNova Solutions",
    phone: "+880 1811-000002",
    email: "hr@technovabd.com",
    location: "Banani Office",
    packageType: "Corporate Headshots",
    amount: 45000,
    date: "2026-08-02",
    status: "Pending",
    notes: "Morning session only (9 AM - 1 PM). Needs pure black backdrop.",
  },
  {
    id: "ORD-2026-091",
    customer: "Zara Rahman",
    phone: "+880 1911-000003",
    email: "zara.r@email.com",
    location: "Hatirjheel, Dhaka",
    packageType: "Outdoor Portrait",
    amount: 15000,
    date: "2026-07-28",
    status: "Accepted",
    notes: "Golden hour shoot. Client bringing multiple outfits.",
  },
  {
    id: "ORD-2026-092",
    customer: "Ahmed Family",
    phone: "+880 1511-000004",
    email: "ahmed.fam@email.com",
    location: "Sylhet Club",
    packageType: "Family Event",
    amount: 80000,
    date: "2026-08-20",
    status: "Pending",
    notes:
      "Anniversary party. Needs quick turnaround for a slideshow presentation.",
  },
  {
    id: "ORD-2026-093",
    customer: "Nafisa & Tariq",
    phone: "+880 1611-000005",
    email: "naf.tariq@email.com",
    location: "Grand Sultan, Sreemangal",
    packageType: "Destination Wedding",
    amount: 350000,
    date: "2026-09-10",
    status: "Cancelled",
    notes: "Event dates changed. Client will rebook later.",
  },
];

// Cohesive status palette
const statusConfig = {
  Accepted: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Filtering Logic
  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalAccepted = ordersData.filter(
    (o) => o.status === "Accepted",
  ).length;
  const totalPending = ordersData.filter((o) => o.status === "Pending").length;
  const potentialRevenue = ordersData
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <AdminLayout>
      <div className="relative max-w-[1400px] mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiShoppingBag className="text-orange-500" /> Order Management
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-lg leading-relaxed">
              Review booking requests, manage customer details, verify
              locations, and approve new shoots.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-inner w-full md:w-auto">
            <FiShoppingBag size={18} className="text-orange-500" /> Create
            Manual Order
          </button>
        </div>

        {/* Stats Overview */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-emerald-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner">
                <FiCheckCircle size={20} />
              </div>
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold">
                Accepted Shoots
              </h3>
            </div>
            <p className="text-3xl font-black text-white">{totalAccepted}</p>
          </div>

          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-amber-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
                <FiClock size={20} />
              </div>
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold">
                Pending Approval
              </h3>
            </div>
            <p className="text-3xl font-black text-amber-400">{totalPending}</p>
          </div>

          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner">
                <span className="font-serif font-bold text-lg leading-none">
                  ৳
                </span>
              </div>
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold">
                Pipeline Value
              </h3>
            </div>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300">
              ৳{potentialRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
            />
          </div>

          <div className="relative w-full lg:w-48 shrink-0">
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
              <option className="bg-[#0A0A0A]">Accepted</option>
              <option className="bg-[#0A0A0A]">Pending</option>
              <option className="bg-[#0A0A0A]">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Master Orders Table */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 relative z-10 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <FiShoppingBag className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white">No orders found</h3>
              <p className="text-neutral-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-5 pl-6">Order Details</th>
                    <th className="p-5">Customer Info</th>
                    <th className="p-5">Event & Location</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Notes</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Order Details */}
                      <td className="p-5 pl-6 align-top">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors mb-1">
                          {order.id}
                        </div>
                        <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                          <FiCalendar size={12} />
                          {new Date(order.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="mt-2 font-bold text-orange-400">
                          ৳{order.amount.toLocaleString()}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="p-5 align-top">
                        <div className="font-bold text-neutral-200 mb-1">
                          {order.customer}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mb-1">
                          <FiPhone size={12} /> {order.phone}
                        </div>
                        <div className="text-xs text-neutral-500 font-medium">
                          {order.email}
                        </div>
                      </td>

                      {/* Event & Location */}
                      <td className="p-5 align-top">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-bold text-neutral-300 mb-2">
                          {order.packageType}
                        </div>
                        <div className="text-xs text-neutral-400 font-medium flex items-start gap-1.5 max-w-[200px] whitespace-normal">
                          <FiMapPin
                            size={14}
                            className="mt-0.5 shrink-0 text-orange-500/70"
                          />
                          <span className="leading-relaxed">
                            {order.location}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-5 align-top">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${statusConfig[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Notes (Hover Tooltip Approach) */}
                      <td className="p-5 align-top">
                        <div className="relative group/note cursor-help inline-flex items-center gap-2 p-2 rounded-lg bg-[#050505] border border-white/5 hover:border-white/20 transition-all">
                          <FiFileText className="text-neutral-400 group-hover/note:text-white" />
                          <span className="text-xs text-neutral-500 font-medium max-w-[100px] truncate">
                            {order.notes}
                          </span>

                          {/* Custom Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-800 border border-white/10 rounded-xl text-xs text-white leading-relaxed opacity-0 invisible group-hover/note:opacity-100 group-hover/note:visible transition-all shadow-2xl z-50 whitespace-normal pointer-events-none">
                            {order.notes}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800"></div>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-5 pr-6 text-right align-top">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          {order.status === "Pending" && (
                            <>
                              <button
                                className="p-2 bg-[#050505] border border-emerald-500/30 hover:border-emerald-500 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-all"
                                title="Accept Order"
                              >
                                <FiCheck className="w-4 h-4" />
                              </button>
                              <button
                                className="p-2 bg-[#050505] border border-red-500/30 hover:border-red-500 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                                title="Reject Order"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="View Full Details"
                          >
                            <FiEye className="w-4 h-4" />
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
