"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiFileText,
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

// 1. Define the status configuration object
const statusConfig = {
  Paid: "text-green-400 bg-green-400/10 border-green-400/20",
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Overdue: "text-red-400 bg-red-400/10 border-red-400/20",
  Draft: "text-neutral-400 bg-neutral-400/10 border-neutral-400/20",
};

// 2. Create a specific type for the status from the keys of the config object
type InvoiceStatus = keyof typeof statusConfig;

// 3. Define the structure of an Invoice object using the new status type
interface Invoice {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  eventName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export default function InvoicesPage() {
  // 4. Use the Invoice interface to type your state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // This is a mock fetch. Replace with your actual API endpoint.
        const response = await new Promise<{
          data: Invoice[];
          success: boolean;
        }>((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                data: [
                  {
                    _id: "1",
                    invoiceNumber: "INV-001",
                    clientName: "John Doe",
                    eventName: "Smith Wedding",
                    amount: 50000,
                    issueDate: "2024-07-01",
                    dueDate: "2024-07-15",
                    status: "Paid",
                  },
                  {
                    _id: "2",
                    invoiceNumber: "INV-002",
                    clientName: "Jane Smith",
                    eventName: "Corporate Gala",
                    amount: 75000,
                    issueDate: "2024-07-05",
                    dueDate: "2024-08-01",
                    status: "Pending",
                  },
                  {
                    _id: "3",
                    invoiceNumber: "INV-003",
                    clientName: "Peter Jones",
                    eventName: "Birthday Bash",
                    amount: 25000,
                    issueDate: "2024-06-10",
                    dueDate: "2024-06-25",
                    status: "Overdue",
                  },
                ],
              }),
            1000,
          ),
        );
        if (response.success) setInvoices(response.data);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        {/* Header Section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight flex items-center gap-3">
              <FiFileText className="text-orange-500" /> Invoices
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Create, send, and track the status of all your client invoices.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:shadow-[0_0_30px_rgba(234,88,12,0.5)] transform active:scale-95 border-none w-full md:w-auto">
            <FiPlus size={18} /> Create Invoice
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 relative z-10">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by client or invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-inner"
              />
            </div>

            {/* Status Filter */}
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
                {Object.keys(statusConfig).map((status) => (
                  <option key={status} value={status} className="bg-[#0A0A0A]">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-t-2 border-orange-500 animate-spin"></div>
              </div>
              <p className="text-neutral-400 font-medium animate-pulse">
                Loading invoices...
              </p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <FiSearch className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-bold text-white">
                No invoices found
              </h3>
              <p className="text-neutral-400">
                Try adjusting your filters or create a new invoice.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-5 pl-6">Invoice #</th>
                    <th className="p-5">Client & Event</th>
                    <th className="p-5">Amount</th>
                    <th className="p-5">Due Date</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="p-5 pl-6 font-mono text-neutral-300">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-white group-hover:text-orange-100 transition-colors">
                          {invoice.clientName}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 font-medium">
                          {invoice.eventName}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-white">
                        ৳{invoice.amount.toLocaleString()}
                      </td>
                      <td className="p-5 text-neutral-300">
                        {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-5">
                        {/* This is where the error was. It's now fixed because invoice.status is strongly typed. */}
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${
                            statusConfig[invoice.status] ||
                            statusConfig["Pending"]
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 bg-[#050505] border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-neutral-400 hover:text-orange-400 rounded-lg transition-all"
                            title="Edit Invoice"
                          >
                            <FiEdit2 className="w-4 h-4" />
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
