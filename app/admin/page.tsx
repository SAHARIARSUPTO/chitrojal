"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../components/home/AdminLayout";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiTrendingUp,
} from "react-icons/fi";

type DashboardMetric = {
  label: string;
  value: number;
  kind: "count" | "currency";
  detail: string;
  icon: "calendar" | "check" | "dollar" | "clock";
};

type DashboardEvent = {
  _id: string;
  name: string;
  type?: string;
  date?: string;
  location?: string;
  photographer?: string;
  status?: string;
  clientName?: string;
  contactNumber?: string;
  totalAmount?: number;
  price?: number;
};

type DashboardOrder = {
  _id: string;
  customerName: string;
  package: string;
  eventDate?: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
};

const iconMap = {
  calendar: FiCalendar,
  check: FiCheckCircle,
  dollar: FiDollarSign,
  clock: FiClock,
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<DashboardEvent[]>([]);
  const [recentOrders, setRecentOrders] = useState<DashboardOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to load dashboard data");
        }
        const result = await response.json();
        if (result.success) {
          setMetrics(result.data.metrics || []);
          setUpcomingEvents(result.data.upcomingEvents || []);
          setRecentOrders(result.data.recentOrders || []);
        }
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-neutral-400 mt-2 text-sm max-w-md leading-relaxed">
              Monitor live event activity, payment status, and the latest client
              orders from your database.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/orders/new"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
            >
              <FiPlus size={16} /> Create Order
            </Link>
            <Link
              href="/admin/invoices"
              className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              <FiFileText size={16} /> Create Invoice
            </Link>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 animate-pulse"
                >
                  <div className="h-3 w-24 rounded bg-white/10 mb-4" />
                  <div className="h-8 w-20 rounded bg-white/10 mb-3" />
                  <div className="h-3 w-32 rounded bg-white/10" />
                </div>
              ))
            : metrics.map((stat) => {
                const Icon = iconMap[stat.icon];
                return (
                  <div
                    key={stat.label}
                    className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                      <Icon size={64} className="text-orange-500" />
                    </div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-white/5 rounded-xl text-orange-500 border border-white/10 group-hover:bg-orange-500/10 transition-colors shadow-inner">
                        <Icon size={20} />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-neutral-400 text-xs uppercase tracking-widest font-bold mb-1">
                        {stat.label}
                      </h3>
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 mb-3 drop-shadow-sm">
                        {stat.kind === "currency"
                          ? formatCurrency(stat.value)
                          : stat.value}
                      </p>
                      <div className="flex items-center text-xs font-semibold text-neutral-500">
                        <FiTrendingUp className="mr-1.5" />
                        {stat.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="p-6 border-b border-white/5 flex justify-between items-center relative z-10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <FiCalendar className="text-orange-500 text-xl" />
                  </div>
                  Upcoming Events
                </h2>
              </div>
              <Link
                href="/admin/events"
                className="text-sm font-semibold text-neutral-400 hover:text-orange-400 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#050505]/50 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
                    <th className="p-5">Event</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-5 text-neutral-400">
                        Loading events...
                      </td>
                    </tr>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="font-bold text-white">
                            {event.name}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1 font-medium">
                            {event.type || "Event"}
                            {event.clientName ? ` • ${event.clientName}` : ""}
                          </div>
                        </td>
                        <td className="p-5 text-neutral-300 font-medium">
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-BD", {
                                dateStyle: "medium",
                              })
                            : "—"}
                        </td>
                        <td className="p-5 text-neutral-300 font-medium">
                          {event.location || "—"}
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1.5 rounded-lg text-xs font-bold border text-amber-400 bg-amber-400/10 border-amber-400/20">
                            {event.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-5 text-neutral-400">
                        No upcoming events yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div className="p-6 border-b border-white/5 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <FiDollarSign className="text-orange-500" />
                  </div>
                  Recent Orders
                </h2>
              </div>

              <div className="p-6 space-y-4 relative z-10">
                {loading ? (
                  <div className="text-neutral-400 text-sm">
                    Loading recent orders...
                  </div>
                ) : recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="rounded-xl border border-white/10 bg-[#050505] p-4"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <div className="font-semibold text-white">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            {order.package}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${order.dueAmount > 0 ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"}`}
                        >
                          {order.dueAmount > 0 ? "Due" : "Paid"}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-neutral-400 flex items-center justify-between">
                        <span>
                          {order.eventDate
                            ? new Date(order.eventDate).toLocaleDateString(
                                "en-BD",
                              )
                            : "—"}
                        </span>
                        <span className="text-white font-semibold">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-neutral-500 flex justify-between">
                        <span>Paid: {formatCurrency(order.paidAmount)}</span>
                        <span>Due: {formatCurrency(order.dueAmount)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-400 text-sm">
                    No orders found yet.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-orange-500/30 rounded-[2rem] p-6 relative overflow-hidden shadow-[0_0_30px_rgba(234,88,12,0.05)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <FiClock className="text-orange-500" /> Live Overview
                </h3>
                <span className="text-orange-500 text-sm font-black">
                  Updated
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium relative z-10">
                These cards pull data from your events and orders collections,
                so new bookings and payments are reflected automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
