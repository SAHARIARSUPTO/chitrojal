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
  FiLink,
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
  icon: "calendar" | "check" | "dollar" | "clock" | "users";
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
  users: FiUsers,
};

const featureIconMap = {
  calendar: FiCalendar,
  camera: FiCamera,
  users: FiUsers,
  link: FiLink,
  note: FiClipboard, // Assuming FiClipboard for 'note' if not explicitly defined
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
  const [userRole, setUserRole] = useState<string | null>(null);

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
        const response = await fetch("/api/event-managements");
        if (!response.ok) {
          throw new Error("Failed to load calendar events");
        }
        const result = await response.json();
        setCalendarEvents(result || []);
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
  
  const visibleStaffFeatures = useMemo(() => {
    if (!userRole) return [];
    if (userRole === 'admin') return staffFeatures;
    return staffFeatures.filter(feature => feature.audience === 'staff' || feature.audience === 'all');
  }, [staffFeatures, userRole]);

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const selectedDayEvents = eventMap[selectedDateKey] || [];
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-12 text-neutral-200 p-4">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none translate-y-[-50%]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
              Monitor live event activity, payment status, and the latest client
              orders from your database.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {userRole === "admin" && (
              <>
                <Link
                  href="/admin/event-managements/new"
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                >
                  <FiPlus size={14} /> New Event
                </Link>
                <Link
                  href="/admin/invoices"
                  className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 hover:border-orange-500/50 hover:bg-white/5 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  <FiFileText size={14} /> Create Invoice
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:p-4 animate-pulse"
                >
                  <div className="h-2.5 w-16 rounded bg-white/10 mb-3" />
                  <div className="h-7 w-16 rounded bg-white/10 mb-2" />
                  <div className="h-2.5 w-24 rounded bg-white/10" />
                </div>
              ))
            : metrics.map((stat) => {
                const Icon = iconMap[stat.icon];
                return (
                  <div
                    key={stat.label}
                    className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:p-4 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group shadow-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                      <Icon size={32} className="text-orange-500" />
                    </div>

                    <div className="flex justify-between items-start mb-3 relative z-10">
                      <div className="p-2 bg-white/5 rounded-lg text-orange-500 border border-white/10 group-hover:bg-orange-500/10 transition-colors shadow-inner">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h3 className="text-neutral-400 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold mb-1 leading-tight">
                        {stat.label}
                      </h3>
                      <p className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-300 mb-2 drop-shadow-sm break-words leading-none">
                        {stat.kind === "currency"
                          ? formatCurrency(stat.value)
                          : stat.value}
                      </p>

                      <div className="flex items-center text-[10px] sm:text-[11px] font-semibold text-neutral-500 leading-tight">
                        <FiTrendingUp className="mr-1.5" />
                        {stat.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
        {/* Staff Features / Quick Links */}
        {visibleStaffFeatures.length > 0 && (
          <div className="relative z-10 pt-4">
            <h2 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {visibleStaffFeatures.map((feature) => {
                const Icon =
                  featureIconMap[
                    feature.iconKey as keyof typeof featureIconMap
                  ] || FiClipboard; // Fallback icon
                const isPoseLibrary = feature.href === "/admin/poses";
                const highlightClass =
                  userRole === "staff" && isPoseLibrary
                    ? "border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
                    : "";

                return (
                  <Link
                    href={feature.href}
                    key={feature._id}
                    className={`bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-3 sm:p-4 hover:border-orange-500/30 transition-all duration-300 relative overflow-hidden group min-w-0 ${highlightClass}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
                    <div className="flex items-start gap-2.5 sm:gap-3 relative z-10">
                      <div className="shrink-0 p-2 bg-white/5 rounded-lg text-orange-500 border border-white/10 group-hover:bg-orange-500/10 transition-colors shadow-inner">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[11px] sm:text-sm md:text-base font-bold text-white leading-tight break-words">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-[10px] sm:text-[11px] md:text-xs text-neutral-400 leading-snug break-words">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {feature.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[10px] sm:text-[11px] font-semibold">
                        {feature.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {userRole !== "staff" && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Event Calendar (order-1 on mobile, order-2 on large) */}
          <div className="md:col-span-1 space-y-6 order-1 lg:order-2">
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl relative overflow-visible">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div className="p-4 border-b border-white/5 relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <FiCalendar className="text-base text-orange-500" />
                      </div>
                      Event Calendar
                    </h2>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-right">
                    <div className="text-sm font-semibold text-white">
                      {format(currentMonth, "MMMM yyyy")}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(subMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                      >
                        <FiChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentMonth(addMonths(currentMonth, 1))
                        }
                        className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/20 text-neutral-400 hover:text-orange-400 transition-all border border-transparent hover:border-orange-500/30"
                      >
                        <FiChevronRight className="w-4 h-4" />
                      </button>
                    </div>
      </div>
                </div>
              </div>

              <div className="p-4 relative z-10">
                {calendarLoading ? (
                  <div className="animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                      <div className="flex gap-2">
                        <div className="h-8 w-8 bg-neutral-800 rounded-lg"></div>
                        <div className="h-8 w-8 bg-neutral-800 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-neutral-500 mb-3">
                      {Array.from({ length: 7 }).map((_, index) => (
                        <div key={index} className="h-3 bg-neutral-800 rounded w-4 mx-auto"></div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 7 }).map((_, j) => (
                            <div key={j} className="h-10 bg-neutral-800/50 rounded-lg"></div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mb-3">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const dayLabel = format(
                          addDays(startOfWeek(new Date()), index),
                          "EE",
                        );
                        return <div key={index}>{dayLabel}</div>;
                      })}
                    </div>
                    <div className="space-y-1">
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
                                className={`group relative flex h-10 w-full items-center justify-center rounded-lg transition-all duration-200 focus:outline-none active:scale-95 ${
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
                                <span className="relative z-10 text-xs font-semibold">
                                  {formattedDate}
                                </span>
                                {isToday && !isSelected ? (
                                  <span className="absolute inset-x-1/4 bottom-1 h-0.5 rounded-full bg-orange-500/70"></span>
                                ) : null}
                                {hasEvents ? (
                                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]"></span>
                                ) : null}

                                {hasEvents ? (
                                  <div className="pointer-events-none absolute left-1/2 top-full z-20 -translate-x-1/2 w-64 rounded-xl border border-white/10 bg-[#050505] p-3 text-left text-xs text-neutral-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 shadow-2xl">
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
                              className="grid grid-cols-7 gap-1"
                            >
                              {days}
                            </div>,
                          );
                          days = [];
                        }
                        return rows;
                      })()}
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-[#080808]/90 p-3 text-sm text-neutral-300">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-neutral-500">
                            Selected date
                          </p>
                          <p className="mt-1 text-white font-semibold text-sm">
                            {format(selectedDate, "MMMM d, yyyy")}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-widest text-neutral-400">
                          {selectedDayEvents.length} event
                          {selectedDayEvents.length === 1 ? "" : "s"}
                        </span>
                      </div>
                      {selectedDayEvents.length > 0 ? (
                        <div className="space-y-2">
                          {selectedDayEvents.map((event) => (
                            <div
                              key={event._id}
                              className="rounded-lg bg-white/5 p-2"
                            >
                              <div className="font-semibold text-white text-sm">
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
                          No events for this day.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Events (order-2 on mobile, order-1 on large) */}
          <div className="md:col-span-2 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

            <div className="p-4 border-b border-white/5 flex justify-between items-center relative z-10">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <FiCalendar className="text-base text-orange-500" />
                  </div>
                  Upcoming Events
                </h2>
              </div>
              <Link
                href="/admin/event-managements"
                className="text-sm font-semibold text-neutral-400 hover:text-orange-400 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="overflow-x-auto relative z-10">
              <table className="w-full min-w-[640px] text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#050505]/50 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-xs font-semibold">
                    <th className="p-4">Event</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 hidden sm:table-cell">Location</th>
                    <th className="p-4 hidden sm:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="p-4">
                          <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                          <div className="h-3 bg-neutral-800/50 rounded w-1/2 mt-2"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="h-4 bg-neutral-800 rounded w-1/3"></div>
                        </td>
                      </tr>
                    ))
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">
                            {event.name}
                          </div>
                          <div className="text-xs text-neutral-500 mt-1 font-medium">
                            {event.type || "Event"}
                            {event.clientName ? ` • ${event.clientName}` : ""}
                          </div>
                        </td>
                        <td className="p-4 text-neutral-300 font-medium text-sm">
                          {event.date
                            ? new Date(event.date).toLocaleDateString("en-BD", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="p-4 text-neutral-300 font-medium text-sm hidden sm:table-cell">
                          {event.location || "—"}
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold border text-amber-400 bg-amber-400/10 border-amber-400/20">
                            {event.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-neutral-400"
                      >
                        No upcoming events yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}
