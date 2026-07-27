"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "../components/home/AdminLayout";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiCamera,
  FiUsers,
  FiClipboard,
  FiTrendingUp,
} from "react-icons/fi";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

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

type StaffFeature = {
  _id: string;
  title: string;
  description: string;
  href: string;
  iconKey: string;
  badge?: string;
  audience: "all" | "admin" | "staff";
  active?: boolean;
};

const iconMap = {
  calendar: FiCalendar,
  check: FiCheckCircle,
  dollar: FiDollarSign,
  clock: FiClock,
};

const featureIconMap = {
  calendar: FiCalendar,
  camera: FiCamera,
  users: FiUsers,
  note: FiClipboard,
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<DashboardEvent[]>([]);
  const [staffFeatures, setStaffFeatures] = useState<StaffFeature[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<DashboardEvent[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
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
        }
      } catch (error) {
        console.error("Error loading dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadStaffFeatures = async () => {
      try {
        const response = await fetch("/api/admin/staff-features");
        if (!response.ok) {
          throw new Error("Failed to load staff features");
        }
        const result = await response.json();
        if (result.success) {
          setStaffFeatures(result.data || []);
        }
      } catch (error) {
        console.error("Error loading staff features", error);
      }
    };

    loadStaffFeatures();
  }, []);

  useEffect(() => {
    const loadCalendarEvents = async () => {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to load calendar events");
        }
        const result = await response.json();
        if (result.success) {
          setCalendarEvents(result.data || []);
        }
      } catch (error) {
        console.error("Error loading calendar events", error);
      } finally {
        setCalendarLoading(false);
      }
    };

    loadCalendarEvents();
  }, []);

  const eventMap = useMemo(() => {
    return calendarEvents.reduce<Record<string, DashboardEvent[]>>(
      (map, event) => {
        if (!event.date) return map;
        const key = format(new Date(event.date), "yyyy-MM-dd");
        if (!map[key]) {
          map[key] = [];
        }
        map[key].push(event);
        return map;
      },
      {},
    );
  }, [calendarEvents]);

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDayEvents = eventMap[selectedDateKey] || [];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

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

        <div className="relative z-10">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-bold text-white">
                Staff Features
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Dynamic shortcuts and reminders from the database.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {staffFeatures.length > 0 ? (
              staffFeatures.map((feature) => {
                const Icon =
                  featureIconMap[
                    feature.iconKey as keyof typeof featureIconMap
                  ] || FiFileText;

                return (
                  <Link
                    key={feature._id}
                    href={feature.href}
                    className="group rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl p-5 hover:border-orange-500/30 transition-all duration-300 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                        <Icon size={20} />
                      </div>
                      {feature.badge ? (
                        <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                          {feature.badge}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                );
              })
            ) : (
              <div className="rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]/80 p-5 text-sm text-neutral-500">
                No staff features found.
              </div>
            )}
          </div>
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
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-visible">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div className="p-6 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <FiCalendar className="text-orange-500 text-xl" />
                      </div>
                      Event Calendar
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      Today&apos;s date is highlighted and event days show details on
                      hover.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="text-sm font-semibold text-white">
                      {format(currentMonth, "MMMM yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(subMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(addMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-xl bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 relative z-10">
                {calendarLoading ? (
                  <div className="text-neutral-400 text-sm">
                    Loading calendar...
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const dayLabel = format(
                          addDays(startOfWeek(new Date()), index),
                          "EE",
                        );
                        return <div key={index}>{dayLabel}</div>;
                      })}
                    </div>
                    <div className="space-y-2">
                      {(() => {
                        const rows = [];
                        let day = startDate;
                        let days: React.ReactNode[] = [];
                        while (day <= endDate) {
                          for (let i = 0; i < 7; i++) {
                            const formattedDate = format(day, "d");
                            const dayKey = format(day, "yyyy-MM-dd");
                            const hasEvents = Boolean(eventMap[dayKey]?.length);
                            const cloneDay = new Date(day.getTime());
                            const isSelected = isSameDay(
                              cloneDay,
                              selectedDate,
                            );
                            const isCurrentMonth = isSameMonth(
                              cloneDay,
                              monthStart,
                            );
                            const isToday = isSameDay(cloneDay, new Date());

                            days.push(
                              <button
                                key={cloneDay.toString()}
                                type="button"
                                onClick={() => setSelectedDate(cloneDay)}
                                className={`group relative flex h-12 w-full items-center justify-center rounded-2xl transition-all duration-200 focus:outline-none active:scale-95 ${
                                  isSelected
                                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.35)]"
                                    : isCurrentMonth
                                      ? "bg-white/5 text-neutral-200 hover:bg-white/10"
                                      : "bg-transparent text-neutral-500"
                                }`}
                                title={
                                  hasEvents
                                    ? `${eventMap[dayKey].length} event(s)`
                                    : "No events"
                                }
                              >
                                <span className="relative z-10 text-sm font-semibold">
                                  {formattedDate}
                                </span>
                                {isToday && !isSelected ? (
                                  <span className="absolute inset-x-1/4 bottom-2 h-1 rounded-full bg-orange-500/70"></span>
                                ) : null}
                                {hasEvents ? (
                                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]"></span>
                                ) : null}

                                {hasEvents ? (
                                  <div className="pointer-events-none absolute left-1/2 top-full z-20 -translate-x-1/2 w-64 rounded-2xl border border-white/10 bg-[#050505] p-3 text-left text-xs text-neutral-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-2xl">
                                    <div className="font-semibold text-white mb-2">
                                      Events
                                    </div>
                                    {eventMap[dayKey].map((event) => (
                                      <div
                                        key={event._id}
                                        className="mb-2 last:mb-0"
                                      >
                                        <div className="font-semibold text-sm text-white">
                                          {event.name}
                                        </div>
                                        <div className="text-[11px] text-neutral-400 leading-5">
                                          {event.type || "Event"}
                                          {event.location
                                            ? ` • ${event.location}`
                                            : ""}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : null}
                              </button>,
                            );
                            day = addDays(day, 1);
                          }

                          rows.push(
                            <div
                              key={day.toString()}
                              className="grid grid-cols-7 gap-2"
                            >
                              {days}
                            </div>,
                          );
                          days = [];
                        }
                        return rows;
                      })()}
                    </div>

                    <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-[#080808]/90 p-4 text-sm text-neutral-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-neutral-500">
                            Selected date
                          </p>
                          <p className="mt-1 text-white font-semibold">
                            {format(selectedDate, "MMMM d, yyyy")}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
                          {selectedDayEvents.length} event
                          {selectedDayEvents.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      {selectedDayEvents.length > 0 ? (
                        <div className="space-y-3">
                          {selectedDayEvents.map((event) => (
                            <div
                              key={event._id}
                              className="rounded-2xl bg-white/5 p-3"
                            >
                              <div className="font-semibold text-white">
                                {event.name}
                              </div>
                              <div className="text-xs text-neutral-400 mt-1">
                                {event.type || "Event"}
                                {event.location ? ` · ${event.location}` : ""}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500">
                          No events for this day. Hover or click highlighted
                          dates to preview event details.
                        </p>
                      )}
                    </div>
                  </>
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
