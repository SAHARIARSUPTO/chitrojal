"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiEye,
  FiDownload,
  FiSearch,
  FiFilter,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

type InvoiceRecord = {
  _id: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  eventDate?: string;
  package?: string;
  totalAmount: number;
  paidAmount?: number;
  dueAmount?: number;
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function InvoicesPage() {
  const [records, setRecords] = useState<InvoiceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(
    null,
  );

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (Array.isArray(data)) {
          setRecords(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadInvoices();
    const handleFocus = () => loadInvoices();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const filteredInvoices = useMemo(() => {
    return records.filter((invoice) => {
      const query =
        `${invoice.customerName} ${invoice.package || ""}`.toLowerCase();
      const matchesSearch = query.includes(searchTerm.toLowerCase());
      const status =
        invoice.dueAmount && invoice.dueAmount > 0 ? "Pending" : "Paid";
      const matchesStatus =
        statusFilter === "All Status" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = records.reduce(
      (sum, invoice) => sum + (invoice.totalAmount || 0),
      0,
    );
    const paid = records.reduce(
      (sum, invoice) => sum + (invoice.paidAmount || 0),
      0,
    );
    const overdue = records.filter(
      (invoice) => (invoice.dueAmount || 0) > 0,
    ).length;
    return { totalRevenue, paid, overdue, count: records.length };
  }, [records]);

  const handleDownload = async (invoice: InvoiceRecord) => {
    const response = await fetch(`/api/invoices/${invoice._id}`);
    if (!response.ok) return;
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${invoice._id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiFileText className="text-orange-500" /> Invoices
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Generate clean invoice records from live orders and download
              professional PDF copies.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Invoices",
              value: stats.count,
              icon: FiFileText,
              color: "text-orange-500",
            },
            {
              label: "Total Revenue",
              value: formatCurrency(stats.totalRevenue),
              icon: FiDollarSign,
              color: "text-white",
            },
            {
              label: "Paid",
              value: formatCurrency(stats.paid),
              icon: FiCheckCircle,
              color: "text-emerald-400",
            },
            {
              label: "Overdue",
              value: stats.overdue,
              icon: FiAlertCircle,
              color: "text-red-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <stat.icon className={stat.color} />
                </div>
                <div>
                  <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold">
                    {stat.label}
                  </h3>
                  <p
                    className={`text-2xl font-black ${stat.color === "text-white" ? "text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300" : stat.color}`}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search invoice by client or package..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600"
              />
            </div>
            <div className="relative w-full md:w-64">
              <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white"
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-5 pl-6">Invoice</th>
                  <th className="p-5">Client</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((invoice) => {
                  const status =
                    invoice.dueAmount && invoice.dueAmount > 0
                      ? "Pending"
                      : "Paid";
                  return (
                    <tr
                      key={invoice._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5 pl-6">
                        <div className="font-bold text-white">
                          INV-{invoice._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          {invoice.package || "Package"}
                        </div>
                      </td>
                      <td className="p-5 text-neutral-300 font-medium">
                        {invoice.customerName}
                      </td>
                      <td className="p-5 text-neutral-300">
                        {invoice.eventDate
                          ? new Date(invoice.eventDate).toLocaleDateString(
                              "en-BD",
                            )
                          : "—"}
                      </td>
                      <td className="p-5 font-bold text-white">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${status === "Paid" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-2 rounded-lg border border-white/10 bg-[#050505] text-neutral-400 hover:text-orange-400"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(invoice)}
                            className="p-2 rounded-lg border border-white/10 bg-[#050505] text-neutral-400 hover:text-orange-400"
                          >
                            <FiDownload className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedInvoice ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-8 text-neutral-200 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-orange-400">
                  Invoice Preview
                </p>
                <h2 className="text-2xl font-bold text-white">Chitro Jal</h2>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-500">Bill To</p>
                <p className="font-semibold text-white">
                  {selectedInvoice.customerName}
                </p>
                <p className="text-sm text-neutral-400">
                  {selectedInvoice.customerEmail || "—"}
                </p>
                <p className="text-sm text-neutral-400">
                  {selectedInvoice.customerPhone || "—"}
                </p>
              </div>
              <div className="text-sm text-neutral-400">
                <p>
                  Invoice No: INV-{selectedInvoice._id.slice(-6).toUpperCase()}
                </p>
                <p>
                  Date:{" "}
                  {selectedInvoice.eventDate
                    ? new Date(selectedInvoice.eventDate).toLocaleDateString(
                        "en-BD",
                      )
                    : "—"}
                </p>
                <p>Package: {selectedInvoice.package || "—"}</p>
              </div>
            </div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#050505] p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm text-neutral-400">
                <span>Item</span>
                <span>Amount</span>
              </div>
              <div className="flex items-center justify-between py-3 text-white">
                <span>{selectedInvoice.package || "Photography Service"}</span>
                <span>{formatCurrency(selectedInvoice.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm text-neutral-400">
                <span>Due</span>
                <span>{formatCurrency(selectedInvoice.dueAmount || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
