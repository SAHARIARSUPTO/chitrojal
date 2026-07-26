"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import Link from "next/link";
import { FiPlus, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    package: "",
    totalAmount: "",
    status: "Pending",
  });

  async function fetchOrders() {
    setLoading(true);
    try {
      const response = await fetch("/api/orders");
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
      package: order.package || "",
      totalAmount: order.totalAmount?.toString() || "",
      status: order.status || "Pending",
    });
  };

  const handleSave = async () => {
    if (!editingOrder) return;
    try {
      const response = await fetch(`/api/orders/${editingOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalAmount: Number(form.totalAmount || 0),
        }),
      });
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
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
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
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <h1 className="text-3xl font-bold">Orders & Bookings</h1>
          <Link
            href="/admin/orders/new"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
          >
            <FiPlus /> New Order
          </Link>
        </div>

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-white/10">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Event Date</th>
                <th className="p-4">Package</th>
                <th className="p-4">Total</th>
                <th className="p-4">Due</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-10">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">
                      {new Date(order.eventDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{order.package}</td>
                    <td className="p-4">
                      ৳{Number(order.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      ৳{Number(order.dueAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusClass(order.status, order.dueAmount)}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        title="View"
                      >
                        <FiEye />
                      </Link>
                      <button
                        onClick={() => openEdit(order)}
                        className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="p-2 rounded-xl hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-10">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6">
            <h2 className="text-xl font-semibold mb-4">Edit order</h2>
            <div className="space-y-4">
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
                value={form.package}
                onChange={(e) => setForm({ ...form, package: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                placeholder="Package"
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
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingOrder(null)}
                className="rounded-xl px-4 py-2 text-neutral-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
