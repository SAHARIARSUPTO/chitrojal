"use client";

import React, { useState } from "react";
import AdminLayout from "../../../components/home/AdminLayout";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    eventDate: "",
    eventLocation: "",
    package: "",
    packageDetails: "",
    googleMapsLink: "",
    bookingSource: "Admin",
    notes: "",
    totalAmount: "",
    advanceAmount: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          totalAmount: Number(formData.totalAmount || 0),
          advanceAmount: Number(formData.advanceAmount || 0),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newOrder = result?.data || result;
        const orderId = newOrder?._id || result?.order?._id || result?.orderId;

        if (orderId) {
          router.push(`/admin/orders/${orderId}`);
        } else {
          alert("Order created, but the page could not open the detail view.");
        }
      } else {
        const errorData = await response.json();
        alert(`Error creating order: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-2xl mx-auto space-y-8 pb-12 text-neutral-200">
        <h1 className="text-3xl font-bold mb-6">Create New Order</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#0A0A0A]/80 p-8 rounded-[1.5rem] border border-white/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Customer Phone</label>
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Customer Address</label>
              <input
                type="text"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Event Date</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Event Location</label>
              <input
                type="text"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Package</label>
              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Package Details</label>
              <input
                type="text"
                name="packageDetails"
                value={formData.packageDetails}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Google Maps Link</label>
              <input
                type="text"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Booking Source</label>
              <input
                type="text"
                name="bookingSource"
                value={formData.bookingSource}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold">Advance Amount</label>
              <input
                type="number"
                name="advanceAmount"
                value={formData.advanceAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Total Amount</label>
              <input
                type="number"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange as any}
              className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
              rows={4}
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold disabled:bg-orange-800"
            >
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
