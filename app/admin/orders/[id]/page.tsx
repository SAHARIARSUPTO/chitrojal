"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../../components/home/AdminLayout";
import { useParams, useRouter } from "next/navigation";
import { FiDownload, FiTrash2, FiPlus } from "react-icons/fi";

export default function OrderDetailPage() {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const fetchOrder = useCallback(async () => {
    if (!id) {
      setOrder(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        console.error("Failed to fetch order");
        setOrder(null);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPayment: {
            amount: Number(paymentAmount),
            method: paymentMethod,
          },
        }),
      });
      if (response.ok) {
        setPaymentAmount("");
        setPaymentMethod("Cash");
        await fetchOrder(); // Re-fetch order to show new payment
      } else {
        alert("Failed to add payment.");
      }
    } catch (error) {
      console.error("Error adding payment", error);
      alert("An error occurred while adding payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (
      confirm(
        "Are you sure you want to delete this order? This action cannot be undone.",
      )
    ) {
      try {
        const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
        if (response.ok) {
          router.push("/admin/orders");
        } else {
          alert("Failed to delete order.");
        }
      } catch (error) {
        console.error("Error deleting order", error);
        alert("An error occurred while deleting the order.");
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center p-10">Loading order details...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center p-10 text-red-500">Order not found.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold">
              Order #{order._id.substring(0, 6)}
            </h1>
            <p className="text-neutral-400">Customer: {order.customerName}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/api/invoices/${order._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
            >
              <FiDownload />
            </a>
            <button
              onClick={handleDeleteOrder}
              className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-[#0A0A0A]/80 p-6 rounded-[1.5rem] border border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h4 className="text-xs text-neutral-400">Total</h4>
            <p className="text-2xl font-bold">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <h4 className="text-xs text-neutral-400">Paid</h4>
            <p className="text-2xl font-bold text-green-400">
              ${order.paidAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <h4 className="text-xs text-neutral-400">Due</h4>
            <p className="text-2xl font-bold text-yellow-400">
              ${order.dueAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <h4 className="text-xs text-neutral-400">Event Date</h4>
            <p className="text-lg font-bold">
              {new Date(order.eventDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment History */}
          <div>
            <h2 className="text-xl font-bold mb-4">Payment History</h2>
            <div className="space-y-3">
              {order.payments?.length > 0 ? (
                order.payments.map((p: any) => (
                  <div
                    key={p._id}
                    className="bg-[#0A0A0A]/80 p-4 rounded-xl border border-white/5 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">${p.amount.toFixed(2)}</p>
                      <p className="text-xs text-neutral-400">{p.method}</p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {new Date(p.date).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-neutral-500">
                  No payments recorded yet.
                </p>
              )}
            </div>
          </div>

          {/* Add Payment */}
          <div>
            <h2 className="text-xl font-bold mb-4">Add Payment</h2>
            <form
              onSubmit={handleAddPayment}
              className="bg-[#0A0A0A]/80 p-6 rounded-[1.5rem] border border-white/5 space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold">Amount</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#050505] border border-white/10"
                >
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-bold disabled:bg-green-800"
                >
                  {isSubmitting ? (
                    "Adding..."
                  ) : (
                    <>
                      <FiPlus /> Add Payment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
