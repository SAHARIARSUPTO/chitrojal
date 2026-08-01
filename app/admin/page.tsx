"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AdminLayout from "../components/home/AdminLayout";
import UpcomingEventsPanel, {
  UpcomingEventItem,
} from "../components/admin/UpcomingEventsPanel";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiDollarSign,
  FiFileText,
  FiImage,
  FiLink,
  FiPlus,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

type DashboardMetric = {
  label: string;
  value: number;
  kind: "count" | "currency";
  detail: string;
  icon: "calendar" | "check" | "dollar" | "clock" | "users" | "image";
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

type DashboardResponse = {
  metrics?: DashboardMetric[];
  upcomingEvents?: UpcomingEventItem[];
};

const iconMap = {
  calendar: FiCalendar,
  check: FiCheckCircle,
  dollar: FiDollarSign,
  clock: FiTrendingUp,
  users: FiUsers,
  image: FiImage,
};

const featureIconMap = {
  calendar: FiCalendar,
  users: FiUsers,
  link: FiLink,
  note: FiClipboard,
};

const metricCardLinks: Record<string, string> = {
  "Upcoming Events": "/admin/event-managements",
  "Events Done": "/admin/event-managements",
  "Payment Received": "/admin/finance",
  "Due Payment": "/admin/finance",
  "Total Staff": "/admin/staff",
  "Photo Library": "/admin/pose-library",
  "Pose Library": "/admin/pose-library",
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>([]);
  const [staffFeatures, setStaffFeatures] = useState<StaffFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.user?.accessRole);
      }
    };
    fetchUserRole();
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to load dashboard data");
        const result = await response.json();
        if (result.success) {
          const data = result.data as DashboardResponse;
          setMetrics(data.metrics || []);
          setUpcomingEvents(data.upcomingEvents || []);
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
    const loadStaffFeatures = async () => {
      const response = await fetch("/api/admin/staff-features");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStaffFeatures(result.data || []);
        }
      }
    };
    loadStaffFeatures();
  }, []);

  const visibleStaffFeatures = useMemo(() => {
    if (!userRole) return [];
    const filteredFeatures = staffFeatures.filter(
      (feature) =>
        feature.title !== "Upcoming Events" &&
        feature.title !== "Pose Library" &&
        feature.title !== "Team Roster",
    );
    if (userRole === "admin") return filteredFeatures;
    return filteredFeatures.filter(
      (feature) => feature.audience === "staff" || feature.audience === "all",
    );
  }, [staffFeatures, userRole]);

  const adminPanels = [
    {
      title: "Booking Management",
      description: "Open bookings, shifts, and payments.",
      href: "/admin/event-managements",
    },
    {
      title: "Invoices",
      description: "View and download invoices.",
      href: "/admin/invoices",
    },
    {
      title: "Photo Gallery",
      description: "Browse poses and reference boards.",
      href: "/admin/pose-library",
    },
    {
      title: "Finance",
      description: "Check revenue and due totals.",
      href: "/admin/finance",
    },
    {
      title: "Staff",
      description: "Manage the team and access.",
      href: "/admin/staff",
    },
  ];

  return (
    <AdminLayout>
      <div className="relative mx-auto max-w-7xl space-y-4 p-4 pb-12 text-neutral-200 sm:space-y-6">
        <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[400px] translate-y-[-50%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[150px]" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="bg-clip-text text-2xl font-bold tracking-tight text-transparent bg-gradient-to-br from-white to-neutral-400 sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-400">
              Jump straight to the correct admin panel cards and manage event
              workflows from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {userRole === "admin" && (
              <>
                <Link
                  href="/admin/event-managements/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all hover:from-orange-500 hover:to-orange-400"
                >
                  <FiPlus size={14} /> New Event
                </Link>
                <Link
                  href="/admin/invoices"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white transition-all hover:border-orange-500/50 hover:bg-white/5"
                >
                  <FiFileText size={14} /> Create Invoice
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 sm:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-2.5 sm:p-4"
                >
                  <div className="mb-2 h-2 w-14 rounded bg-white/10" />
                  <div className="mb-1.5 h-6 w-14 rounded bg-white/10" />
                  <div className="h-2 w-20 rounded bg-white/10" />
                </div>
              ))
            : metrics.map((stat) => {
                const Icon = iconMap[stat.icon];
                const href = metricCardLinks[stat.label] || "/admin";
                return (
                  <Link
                    key={stat.label}
                    href={href}
                    className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-2.5 shadow-lg transition-all duration-300 hover:border-orange-500/30 sm:p-4"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-orange-500 transition-colors group-hover:bg-orange-500/10">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <FiArrowRight className="mt-1.5 h-3.5 w-3.5 text-neutral-500 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="relative z-10 mt-2.5">
                      <h3 className="mb-1 text-[8px] font-bold uppercase tracking-widest text-neutral-400 sm:text-[10px]">
                        {stat.label}
                      </h3>
                      <p className="mb-1.5 break-words bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-lg font-black leading-none text-transparent sm:text-2xl">
                        {stat.kind === "currency"
                          ? formatCurrency(stat.value)
                          : stat.value}
                      </p>
                      <div className="flex items-center text-[9px] font-semibold leading-tight text-neutral-500 sm:text-[11px]">
                        <FiTrendingUp className="mr-1.5" />
                        {stat.detail}
                      </div>
                    </div>
                  </Link>
                );
              })}
        </div>

        {visibleStaffFeatures.length > 0 && (
          <div className="relative z-10 pt-2">
            <h2 className="mb-3 text-base font-bold text-white sm:mb-4 sm:text-lg">
              Quick Links
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
              {visibleStaffFeatures.map((feature) => {
                const Icon =
                  featureIconMap[feature.iconKey as keyof typeof featureIconMap] ||
                  FiClipboard;
                return (
                  <Link
                    href={feature.href}
                    key={feature._id}
                    className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-2.5 transition-all duration-300 hover:border-orange-500/30 sm:p-4"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent" />
                    <div className="relative z-10 flex items-start gap-2.5">
                      <div className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-1.5 text-orange-500 transition-colors group-hover:bg-orange-500/10">
                        <Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-[10px] font-bold leading-tight text-white sm:text-sm md:text-base">
                          {feature.title}
                        </h3>
                        <p className="mt-1 break-words text-[9px] leading-snug text-neutral-400 sm:text-[11px] md:text-xs">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    {feature.badge && (
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-orange-400 sm:text-[11px]">
                        {feature.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative z-10 pt-2">
          <UpcomingEventsPanel events={upcomingEvents} compact={false} />
        </div>

        <div className="relative z-10 pt-2">
          <h2 className="mb-3 text-base font-bold text-white sm:mb-4 sm:text-lg">
            Admin Panels
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
            {adminPanels.map((panel) => (
              <Link
                key={panel.href}
                href={panel.href}
                className="group rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-2.5 transition-all duration-300 hover:border-orange-500/30 hover:bg-white/[0.07] sm:p-4"
              >
                <div className="text-[10px] font-semibold leading-tight text-white sm:text-sm">
                  {panel.title}
                </div>
                <div className="mt-1 text-[9px] leading-snug text-neutral-400 sm:text-xs">
                  {panel.description}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-orange-400 sm:text-xs">
                  Open{" "}
                  <FiArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
