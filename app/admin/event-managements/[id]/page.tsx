"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import Link from "next/link";
import { FiArrowLeft, FiDownload, FiDollarSign } from "react-icons/fi";

type Payment = {
  _id: string;
  amount: number;
  date: string;
  method: string;
};

type Order = {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  eventDate: string;
  eventLocation: string;
  eventName: string;
  eventType: string;
  package: string;
  packageDetails: string;
  googleMapsLink: string;
  bookingSource: string;
  notes: string;
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  photographer: string;
  duration: string;
  payments: Payment[];
};

export default function EventManagementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  async function fetchOrder() {
    if (!id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/event-managements/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);
  
  const handleDownloadInvoice = async () => {
    if(!order) return;
    const response = await fetch(`/api/invoices/${order._id}`);
    if (!response.ok) {
      // Handle error, maybe show a toast notification
      console.error("Failed to download invoice");
      return;
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${order._id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const DetailItem = ({ label, value }: { label: string; value: any }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-neutral-400">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-200 sm:mt-0 sm:col-span-2">{value || 'N/A'}</dd>
    </div>
  );
  
  return (
    <AdminLayout>
      <div className="relative max-w-4xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-bold">Event Details</h1>
            <Link href="/admin/event-managements" className="text-sm text-neutral-400 hover:text-orange-500 flex items-center gap-2 mt-1">
              <FiArrowLeft /> Back to List
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <FiDownload /> Invoice
            </button>
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <FiDollarSign /> Add Payment
            </button>
          </div>
        </div>

        {loading && <p>Loading event details...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {order && (
          <>
            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-white">
                  {order.eventName}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-400">
                  Details for order #{order._id.substring(0, 7)}
                </p>
              </div>
              <div className="border-t border-white/10 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-white/10">
                  <div className="sm:grid sm:grid-cols-1 md:grid-cols-2">
                      <div className="px-4 py-2">
                          <DetailItem label="Customer Name" value={order.customerName} />
                          <DetailItem label="Customer Phone" value={order.customerPhone} />
                          <DetailItem label="Customer Email" value={order.customerEmail} />
                          <DetailItem label="Customer Address" value={order.customerAddress} />
                      </div>
                       <div className="px-4 py-2">
                          <DetailItem label="Event Date" value={new Date(order.eventDate).toLocaleDateString()} />
                          <DetailItem label="Event Location" value={order.eventLocation} />
                          <DetailItem label="Event Type" value={order.eventType} />
                           <DetailItem label="Status" value={order.status} />
                      </div>
                  </div>
                   <div className="bg-black/20 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                      <DetailItem label="Package" value={order.package} />
                      <DetailItem label="Package Details" value={order.packageDetails} />
                  </div>
                  <div className="sm:grid sm:grid-cols-1 md:grid-cols-2">
                      <div className="px-4 py-2">
                          <DetailItem label="Total Amount" value={`৳${order.totalAmount.toLocaleString()}`} />
                          <DetailItem label="Advance Amount" value={`৳${order.advanceAmount.toLocaleString()}`} />
                          <DetailItem label="Paid Amount" value={`৳${order.paidAmount.toLocaleString()}`} />
                          <DetailItem label="Due Amount" value={`৳${order.dueAmount.toLocaleString()}`} />
                      </div>
                      <div className="px-4 py-2">
                          <DetailItem label="Photographer" value={order.photographer} />
                          <DetailItem label="Duration" value={order.duration} />
                          <DetailItem label="Booking Source" value={order.bookingSource} />
                          <DetailItem label="Google Maps" value={order.googleMapsLink ? <a href={order.googleMapsLink} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">View Map</a> : 'N/A'} />
                      </div>
                  </div>
                  {order.notes && (
                      <div className="bg-black/20 px-4 py-5 sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6">
                          <DetailItem label="Notes" value={order.notes} />
                      </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] overflow-hidden">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-white">Payment History</h3>
                </div>
                <div className="border-t border-white/10">
                    {order.payments && order.payments.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="border-b border-white/10 text-sm text-neutral-400">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.payments.map((payment) => (
                                    <tr key={payment._id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-4">{new Date(payment.date).toLocaleDateString()}</td>
                                        <td className="p-4">৳{payment.amount.toLocaleString()}</td>
                                        <td className="p-4">{payment.method}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="p-4 text-neutral-400">No payments recorded yet.</p>
                    )}
                </div>
            </div>
          </>
        )}
      </div>
      
      {isPaymentModalOpen && (
        <AddPaymentModal
          orderId={order?._id}
          onClose={() => setPaymentModalOpen(false)}
          onSuccess={() => {
            setPaymentModalOpen(false);
            fetchOrder();
          }}
        />
      )}
    </AdminLayout>
  );
}

function AddPaymentModal({ orderId, onClose, onSuccess }: { orderId: string | undefined, onClose: () => void, onSuccess: () => void }) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("Cash");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!orderId || !amount || parseFloat(amount) <= 0) {
            setError("Please enter a valid positive amount.");
            return;
        }
        
        setError(null);
        setIsSaving(true);

        try {
            const response = await fetch(`/api/event-managements/${orderId}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    method,
                }),
            });

            if (response.ok) {
                onSuccess();
            } else {
                const data = await response.json();
                setError(data.message || "Failed to save payment.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Add Payment</h2>
                <div className="space-y-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
                        disabled={isSaving}
                    />
                    <select
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3 text-white"
                        disabled={isSaving}
                    >
                        <option>Cash</option>
                        <option>bKash</option>
                        <option>Nagad</option>
                        <option>Bank Transfer</option>
                        <option>Other</option>
                    </select>

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                 <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-neutral-400"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-orange-600 px-4 py-2 font-semibold text-white disabled:bg-neutral-600"
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Save Payment"}
                    </button>
                </div>
            </div>
        </div>
    )
}
