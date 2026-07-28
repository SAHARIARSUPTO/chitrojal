"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/home/AdminLayout";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";

export default function NewEventManagementPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    eventDate: "",
    eventLocation: "",
    eventName: "",
    eventType: "",
    package: "",
    packageDetails: "",
    googleMapsLink: "",
    bookingSource: "Admin",
    notes: "",
    totalAmount: "",
    advanceAmount: "",
    paidAmount: "",
    dueAmount: "",
    status: "Pending",
    photographer: "",
    duration: "",
  });

  const handleSave = async () => {
    try {
      const totalAmount = Number(form.totalAmount || 0);
      const advanceAmount = Number(form.advanceAmount || 0);
      const paidAmount = advanceAmount;
      const dueAmount = totalAmount - paidAmount;

      const response = await fetch("/api/event-managements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          customerAddress: form.customerAddress,
          eventDate: form.eventDate,
          eventLocation: form.eventLocation,
          eventName: form.eventName,
          eventType: form.eventType,
          package: form.package,
          packageDetails: form.packageDetails,
          googleMapsLink: form.googleMapsLink,
          bookingSource: form.bookingSource,
          notes: form.notes,
          status: form.status,
          photographer: form.photographer,
          duration: form.duration,
          totalAmount,
          advanceAmount,
          paidAmount,
          dueAmount,
        }),
      });
      if (response.ok) {
        router.push("/admin/event-managements");
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <h1 className="text-3xl font-bold">New Event Management</h1>
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
          >
            <FiSave /> Save
          </button>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              value={form.customerName}
              onChange={(e) =>
                setForm({ ...form, customerName: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Customer name"
            />
            <input
              value={form.customerPhone}
              onChange={(e) =>
                setForm({ ...form, customerPhone: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Phone"
            />
            <input
              value={form.customerEmail}
              onChange={(e) =>
                setForm({ ...form, customerEmail: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Email"
            />
            <input
              value={form.customerAddress}
              onChange={(e) =>
                setForm({ ...form, customerAddress: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Address"
            />
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) =>
                setForm({ ...form, eventDate: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Event date"
            />
            <input
              value={form.eventLocation}
              onChange={(e) =>
                setForm({ ...form, eventLocation: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Event location"
            />
            <input
              value={form.eventName}
              onChange={(e) =>
                setForm({ ...form, eventName: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Event name"
            />
            <input
              value={form.eventType}
              onChange={(e) =>
                setForm({ ...form, eventType: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Event type"
            />
            <input
              value={form.package}
              onChange={(e) => setForm({ ...form, package: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Package"
            />
            <textarea
              value={form.packageDetails}
              onChange={(e) =>
                setForm({ ...form, packageDetails: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Package details"
            />
            <input
              value={form.googleMapsLink}
              onChange={(e) =>
                setForm({ ...form, googleMapsLink: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Google Maps link"
            />
            <input
              value={form.bookingSource}
              onChange={(e) =>
                setForm({ ...form, bookingSource: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Booking source"
            />
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 md:col-span-2"
              placeholder="Notes"
            />
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) =>
                setForm({ ...form, totalAmount: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Total amount"
            />
            <input
              type="number"
              value={form.advanceAmount}
              onChange={(e) =>
                setForm({ ...form, advanceAmount: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Advance amount"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input
              value={form.photographer}
              onChange={(e) =>
                setForm({ ...form, photographer: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Photographer"
            />
            <input
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
              placeholder="Duration"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
