"use client";

import React, { useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiPlus,
  FiEye,
  FiDownload,
  FiTrash2,
  FiSearch,
  FiMail,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";

// Mock Data
const invoicesData = [
  {
    id: "1",
    invoiceNo: "INV-2024-001",
    orderId: "1001",
    client: "John Smith",
    date: "2024-02-15",
    dueDate: "2024-03-15",
    amount: "৳2,50,000",
    status: "Paid",
  },
  {
    id: "2",
    invoiceNo: "INV-2024-002",
    orderId: "1002",
    client: "Tech Corp Inc",
    date: "2024-02-18",
    dueDate: "2024-03-18",
    amount: "৳1,80,000",
    status: "Paid",
  },
  {
    id: "3",
    invoiceNo: "INV-2024-003",
    orderId: "1003",
    client: "Sarah Johnson",
    date: "2024-02-20",
    dueDate: "2024-03-20",
    amount: "৳60,000",
    status: "Pending",
  },
  {
    id: "4",
    invoiceNo: "INV-2024-004",
    orderId: "1004",
    client: "Innovation Labs",
    date: "2024-02-22",
    dueDate: "2024-03-22",
    amount: "৳3,20,000",
    status: "Overdue",
  },
  {
    id: "5",
    invoiceNo: "INV-2024-005",
    orderId: "1005",
    client: "Mike & Lisa",
    date: "2024-02-25",
    dueDate: "2024-03-25",
    amount: "৳80,000",
    status: "Draft",
  },
];

// Cohesive, "no blue" premium status palette
const statusConfig: { [key: string]: string } = {
  Paid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Overdue: "text-red-400 bg-red-400/10 border-red-400/20",
  Draft: "text-neutral-400 bg-white/5 border-white/10",
};

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Enhanced filtering logic
  const filteredInvoices = invoicesData.filter((invoice) => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiFileText className="text-orange-500" /> Invoices
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Generate, manage, and track all your client invoices and payment
              statuses.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto">
            <FiPlus size={18} /> Create Invoice
          </button>
        </div>

        {/* Premium Invoice Stats Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Invoices",
              value: "24",
              icon: FiFileText,
              color: "text-orange-500",
              bg: "bg-orange-500/10 border-orange-500/20",
            },
            {
              label: "Total Revenue",
              value: "৳5,06,000",
              icon: FiDollarSign,
              color: "text-white",
              bg: "bg-white/5 border-white/10",
            },
            {
              label: "Paid",
              value: "18",
              icon: FiCheckCircle,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10 border-emerald-400/20",
            },
            {
              label: "Overdue",
              value: "1",
              icon: FiAlertCircle,
              color: "text-red-400",
              bg: "bg-red-400/10 border-red-400/20",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>

              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <stat.icon size={64} className={stat.color} />
              </div>

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div
                  className={`p-3 rounded-xl border ${stat.bg} ${stat.color} shadow-inner`}
                >
                  <stat.icon size={20} />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                  {stat.label}
                </h3>
                <p
                  className={`text-3xl font-black ${stat.color === "text-white" ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300" : stat.color} drop-shadow-sm`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search Toolbar */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[1.5rem]"></div>

          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search invoices by client or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            {/* Status Filter */}
            <div className="relative w-full md:w-64">
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
                <option className="bg-[#0A0A0A]">Paid</option>
                <option className="bg-[#0A0A0A]">Pending</option>
                <option className="bg-[#0A0A0A]">Overdue</option>
                <option className="bg-[#0A0A0A]">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

          {filteredInvoices.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-32 space-y-4 relative z-10 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <FiSearch className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white">
                No invoices found
              </h3>
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
                    <th className="p-5 pl-6">Invoice / Order</th>
                    <th className="p-5">Client</th>
                    <th className="p-5">Date & Due Date</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5 pl-6">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors">
                          {invoice.invoiceNo}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-medium">
                          Order ID: {invoice.orderId}
                        </div>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {invoice.client}
                      </td>
                      <td className="p-5">
                        <div className="text-neutral-200 font-medium mb-1">
                          {new Date(invoice.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-neutral-500">
                          Due:{" "}
                          {new Date(invoice.dueDate).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-white">
                        {invoice.amount}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${statusConfig[invoice.status] || statusConfig["Draft"]}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="View Invoice"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="Download PDF"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="Email Invoice"
                          >
                            <FiMail className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-lg transition-all"
                            title="Delete Invoice"
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
