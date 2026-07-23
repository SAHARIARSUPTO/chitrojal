"use client";

import React, { useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiSearch,
  FiDownload,
  FiEye,
  FiCornerUpLeft,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiFilter,
} from "react-icons/fi";

// Contextual Mock Data updated to BDT (৳) for consistency
const paymentsData = [
  {
    id: "1",
    transactionId: "TXN-2024-001",
    orderId: "1001",
    client: "John Smith",
    amount: "250000",
    method: "Card",
    date: "2024-02-15",
    status: "Completed",
  },
  {
    id: "2",
    transactionId: "TXN-2024-002",
    orderId: "1002",
    client: "Tech Corp Inc",
    amount: "180000",
    method: "Bank Transfer",
    date: "2024-02-18",
    status: "Completed",
  },
  {
    id: "3",
    transactionId: "TXN-2024-003",
    orderId: "1003",
    client: "Sarah Johnson",
    amount: "60000",
    method: "Card",
    date: "2024-02-20",
    status: "Pending",
  },
  {
    id: "4",
    transactionId: "TXN-2024-004",
    orderId: "1004",
    client: "Innovation Labs",
    amount: "320000",
    method: "Bank Transfer",
    date: "2024-02-22",
    status: "Pending",
  },
  {
    id: "5",
    transactionId: "TXN-2024-005",
    orderId: "1005",
    client: "Mike & Lisa",
    amount: "40000",
    method: "Cash",
    date: "2024-02-24",
    status: "Completed",
  },
  {
    id: "6",
    transactionId: "TXN-2024-006",
    orderId: "1006",
    client: "Zahra & Rifat",
    amount: "45000",
    method: "Card",
    date: "2024-02-25",
    status: "Failed",
  },
];

// Cohesive, "no blue" premium status palette
const statusConfig: { [key: string]: string } = {
  Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Failed: "text-red-400 bg-red-400/10 border-red-400/20",
};

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [methodFilter, setMethodFilter] = useState("All Methods");

  // Enhanced filtering logic
  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.includes(searchTerm);
    const matchesStatus =
      statusFilter === "All Status" || payment.status === statusFilter;
    const matchesMethod =
      methodFilter === "All Methods" || payment.method === methodFilter;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate dynamic stats
  const totalRevenue = paymentsData
    .filter((p) => p.status === "Completed")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const pendingPaymentsAmount = paymentsData
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const pendingCount = paymentsData.filter(
    (p) => p.status === "Pending",
  ).length;

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]"></div>

        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiCreditCard className="text-orange-500" /> Payments
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Track all transactions, monitor studio revenue, and manage client
              payment methods.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-inner w-full md:w-auto">
            <FiDownload size={18} className="text-orange-500" /> Export Report
          </button>
        </div>

        {/* Premium Payment Stats Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <FiDollarSign size={64} className="text-white" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-white/5 border-white/10 text-white shadow-inner">
                <FiDollarSign size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                Total Revenue
              </h3>
              <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 mb-2 drop-shadow-sm">
                ৳{totalRevenue.toLocaleString()}
              </p>
              <div className="flex items-center text-xs font-semibold text-emerald-400">
                ↑ 15% from last month
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <FiClock size={64} className="text-amber-400" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-amber-400/10 border-amber-400/20 text-amber-400 shadow-inner">
                <FiClock size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                Pending Payments
              </h3>
              <p className="text-3xl font-black text-amber-400 mb-2 drop-shadow-sm">
                ৳{pendingPaymentsAmount.toLocaleString()}
              </p>
              <div className="flex items-center text-xs font-semibold text-amber-500/80">
                {pendingCount} transactions waiting
              </div>
            </div>
          </div>

          {/* Success Rate Card */}
          <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
              <FiCheckCircle size={64} className="text-emerald-400" />
            </div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 rounded-xl border bg-emerald-400/10 border-emerald-400/20 text-emerald-400 shadow-inner">
                <FiCheckCircle size={20} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                Success Rate
              </h3>
              <p className="text-3xl font-black text-emerald-400 mb-2 drop-shadow-sm">
                96.5%
              </p>
              <div className="flex items-center text-xs font-semibold text-emerald-500/80">
                Only 1 failed in 60 days
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
                placeholder="Search by transaction ID, order ID, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
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
                  <option className="bg-[#0A0A0A]">Completed</option>
                  <option className="bg-[#0A0A0A]">Pending</option>
                  <option className="bg-[#0A0A0A]">Failed</option>
                </select>
              </div>
              <div className="relative flex-1 sm:w-48">
                <FiCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.2em 1.2em",
                  }}
                >
                  <option className="bg-[#0A0A0A]">All Methods</option>
                  <option className="bg-[#0A0A0A]">Card</option>
                  <option className="bg-[#0A0A0A]">Bank Transfer</option>
                  <option className="bg-[#0A0A0A]">Cash</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

          {filteredPayments.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-32 space-y-4 relative z-10 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <FiSearch className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white">
                No payments found
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
                    <th className="p-5 pl-6">Transaction / Order</th>
                    <th className="p-5">Client</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Method & Date</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5 pl-6">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors">
                          {payment.transactionId}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-medium">
                          Order: {payment.orderId}
                        </div>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {payment.client}
                      </td>
                      <td className="p-5 font-bold text-white">
                        ৳{parseFloat(payment.amount).toLocaleString()}
                      </td>
                      <td className="p-5">
                        <div className="text-neutral-200 font-medium mb-1">
                          {payment.method}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {new Date(payment.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${statusConfig[payment.status] || statusConfig["Pending"]}`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="View Receipt"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-lg transition-all"
                            title="Refund / Cancel"
                          >
                            <FiCornerUpLeft className="w-4 h-4" />
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
