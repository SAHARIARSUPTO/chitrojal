"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiCalendar,
  FiShoppingCart,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiCamera,
  FiMenu,
  FiSearch,
  FiDollarSign,
  FiLink,
} from "react-icons/fi";
import Image from "next/image";

const navItems = [
  { href: "/admin", icon: FiGrid, label: "Dashboard" },
  { href: "/admin/events", icon: FiCalendar, label: "Events" },
  { href: "/admin/orders", icon: FiShoppingCart, label: "Online Booking" },
  { href: "/admin/invoices", icon: FiFileText, label: "Invoices" },
  { href: "/admin/finance", icon: FiDollarSign, label: "Finance" },
  { href: "/admin/payments", icon: FiCreditCard, label: "Payments" },
  { href: "/admin/photo-drive", icon: FiLink, label: "Photo Drive Links" },
  { href: "/admin/poses", icon: FiCamera, label: "Pose Library" },
  { href: "/admin/staff", icon: FiUsers, label: "Staff" },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  const NavLink = ({
    item,
  }: {
    item: { href: string; icon: React.ElementType; label: string };
  }) => {
    const isActive = pathname === item.href;

    return (
      <Link
        href={item.href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 relative ${
          isActive
            ? "bg-orange-500/10 text-orange-400"
            : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-100"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
        )}
        <item.icon
          className={`h-4 w-4 shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}
        />
        {item.label}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#050505] border-r border-white/5">
      {/* Logo Area */}
      <div className="flex h-16 items-center px-6 border-b border-white/5">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="p-1.5 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <FiCamera className="h-5 w-5 text-orange-500" />
          </div>
          <Image
            src="/logo.png"
            alt="ChitroJal Logo"
            width={100}
            height={26}
            className="h-7 w-auto"
          />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        <nav className="grid gap-1 px-3">
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Main Menu
          </div>
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* User Profile Snippet */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Salman H Choudhury
            </p>
            <p className="text-xs text-neutral-400 truncate">
              Lead Photographer
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] text-neutral-200 selection:bg-orange-500/30">
      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden md:flex flex-col w-[240px] fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="fixed left-0 top-0 h-full w-64 transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area (Pushed right by sidebar width) */}
      <div className="flex-1 flex flex-col md:pl-[240px] min-w-0">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-[#050505] px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <FiMenu size={24} />
            </button>
            {/* Placeholder for breadcrumbs or page title if needed */}
            <div className="flex-1"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">{children}</main>

        {/* Admin Footer */}
        <footer className="border-t border-white/5 bg-[#050505] p-4 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} ChitroJal. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
