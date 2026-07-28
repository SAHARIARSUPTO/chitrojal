"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import Link from "next/link";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPrinter,
  FiDollarSign,
} from "react-icons/fi";

export default function EventManagementsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "Cash",
    notes: "",
  });
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

  async function fetchOrders() {
    setLoading(true);
    try {
      const response = await fetch("/api/event-managements");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const openEdit = (order: any) => {
    setEditingOrder(order);
    setForm({
      customerName: order.customerName || "",
      customerPhone: order.customerPhone || "",
      customerEmail: order.customerEmail || "",
      customerAddress: order.customerAddress || "",
      eventDate: order.eventDate
        ? new Date(order.eventDate).toISOString().split("T")[0]
        : "",
      eventLocation: order.eventLocation || "",
      eventName: order.eventName || "",
      eventType: order.eventType || "",
      package: order.package || "",
      packageDetails: order.packageDetails || "",
      googleMapsLink: order.googleMapsLink || "",
      bookingSource: order.bookingSource || "Admin",
      notes: order.notes || "",
      totalAmount: order.totalAmount?.toString() || "",
      advanceAmount: order.advanceAmount?.toString() || "",
      paidAmount: order.paidAmount?.toString() || "",
      dueAmount: order.dueAmount?.toString() || "",
      status: order.status || "Pending",
      photographer: order.photographer || "",
      duration: order.duration || "",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      const totalAmount = Number(newForm.totalAmount || 0);
      const paidAmount = Number(newForm.paidAmount || 0);
      newForm.dueAmount = (totalAmount - paidAmount).toString();
      return newForm;
    });
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    const totalAmount = Number(form.totalAmount || 0);
    const advanceAmount = Number(form.advanceAmount || 0);
    const paidAmount = Number(form.paidAmount || 0);
    const dueAmount = totalAmount - paidAmount;

    try {
      const response = await fetch(
        `/api/event-managements/${editingOrder._id}`,
        {
          method: "PUT",
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
        },
      );
      if (response.ok) {
        setEditingOrder(null);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const response = await fetch(`/api/event-managements/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const handleSavePayment = async () => {
    if (!paymentOrder) return;
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: paymentOrder._id,
          amount: newPayment.amount,
          method: newPayment.method,
          notes: newPayment.notes,
        }),
      });

      if (response.ok) {
        setNewPayment({ amount: "", method: "Cash", notes: "" });
        setPaymentOrder(null);
        fetchOrders();
      } else {
        console.error("Failed to save payment");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const getStatusClass = (status: string, dueAmount: number) => {
    if (status === "Approved") return "bg-green-500/10 text-green-400";
    if (status === "Cancelled" || status === "Completed")
      return "bg-red-500/10 text-red-400";
    if (dueAmount === 0) return "bg-green-500/10 text-green-400";
    return "bg-yellow-500/10 text-yellow-400";
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-6 pb-12 text-neutral-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-white/10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">
            Event Managements
          </h1>
          <Link
            href="/admin/event-managements/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
          >
            <FiPlus /> New Order
          </Link>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-neutral-400 uppercase tracking-wider font-semibold text-[11px] sm:text-xs">
                  <th className="p-3 sm:p-4">Customer</th>
                  <th className="p-3 sm:p-4">Event Name</th>
                  <th className="p-3 sm:p-4 hidden sm:table-cell">Event Date</th>
                  <th className="p-3 sm:p-4 hidden lg:table-cell">Package</th>
                  <th className="p-3 sm:p-4 hidden xl:table-cell">Location</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Total</th>
                  <th className="p-3 sm:p-4 hidden md:table-cell">Due</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4 hidden lg:table-cell">Photographer</th>
                  <th className="p-3 sm:p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center p-4 text-neutral-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="p-3 sm:p-4 font-medium text-white">
                        {order.customerName}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium">
                        {order.eventName}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden sm:table-cell">
                        {new Date(order.eventDate).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden lg:table-cell">
                        {order.package}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden xl:table-cell">
                        {order.eventLocation}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden md:table-cell">
                        ৳{Number(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden md:table-cell">
                        ৳{Number(order.dueAmount || 0).toLocaleString()}
                      </td>
                      <td className="p-3 sm:p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusClass(
                            order.status,
                            order.dueAmount,
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-neutral-300 font-medium hidden lg:table-cell">
                        {order.photographer}
                      </td>
                      <td className="p-3 sm:p-4 flex gap-2">
                        <Link
                          href={`/admin/invoices/${order._id}`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Print Invoice"
                          target="_blank"
                        >
                          <FiPrinter size={14} />
                        </Link>
                        <button
                          onClick={() => setPaymentOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Manage Payments"
                        >
                          <FiDollarSign size={14} />
                        </button>
                        <button
                          onClick={() => openEdit(order)}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center p-4 text-neutral-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-4xl rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-4">
            <h2 className="text-lg font-semibold mb-4">Edit order</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Customer name"
              />
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Phone"
              />
              <input
                name="customerEmail"
                value={form.customerEmail}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Email"
              />
              <input
                name="customerAddress"
                value={form.customerAddress}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Address"
              />
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Event date"
              />
              <input
                name="eventLocation"
                value={form.eventLocation}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Event location"
              />
              <input
                name="eventName"
                value={form.eventName}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Event name"
              />
              <input
                name="eventType"
                value={form.eventType}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Event type"
              />
              <input
                name="package"
                value={form.package}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Package"
              />
              <textarea
                name="packageDetails"
                value={form.packageDetails}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Package details"
              />
              <input
                name="googleMapsLink"
                value={form.googleMapsLink}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Google Maps link"
              />
              <input
                name="bookingSource"
                value={form.bookingSource}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Booking source"
              />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2 md:col-span-2"
                placeholder="Notes"
              />
              <input
                type="number"
                name="totalAmount"
                value={form.totalAmount}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Total amount"
              />
              <input
                type="number"
                name="advanceAmount"
                value={form.advanceAmount}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Advance amount"
              />
              <input
                type="number"
                name="paidAmount"
                value={form.paidAmount}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Paid amount"
              />
              <input
                type="number"
                name="dueAmount"
                value={form.dueAmount}
                readOnly
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-2"
                placeholder="Due amount"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                name="photographer"
                value={form.photographer}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Photographer"
              />
              <input
                name="duration"
                value={form.duration}
                onChange={handleFormChange}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                placeholder="Duration"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-xl px-3 py-2 text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-orange-600 px-3 py-2 font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Payment Management Modal */}
      {paymentOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-4">
            <h2 className="text-lg font-semibold mb-4">
              Manage Payments for {paymentOrder.eventName}
            </h2>
            <div className="space-y-4">
              {/* New Payment Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Amount"
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, amount: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                />
                <select
                  value={newPayment.method}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, method: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                >
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Card</option>
                  <option>Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Notes"
                  value={newPayment.notes}
                  onChange={(e) =>
                    setNewPayment({ ...newPayment, notes: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-3 py-2"
                />
              </div>
              <button
                onClick={handleSavePayment}
                className="rounded-xl bg-orange-600 px-3 py-2 font-semibold text-white w-full"
              >
                Add Payment
              </button>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold mb-2">Payment History</h3>
              {paymentOrder.payments && paymentOrder.payments.length > 0 ? (
                <ul className="space-y-2">
                  {paymentOrder.payments.map((payment: any) => (
                    <li
                      key={payment._id}
                      className="flex justify-between items-center bg-[#050505] p-3 rounded-lg text-xs"
                    >
                      <div>
                        <p>
                          {new Date(payment.date).toLocaleDateString()} -{" "}
                          {payment.method}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {payment.notes}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ৳{payment.amount.toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-neutral-400 p-3 text-xs">
                  No payment history found.
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPaymentOrder(null)}
                className="rounded-xl px-3 py-2 text-neutral-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
