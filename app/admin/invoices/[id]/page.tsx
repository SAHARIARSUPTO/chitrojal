"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import { FiDownload, FiCheckCircle, FiClock, FiPrinter } from "react-icons/fi";
import Barcode from "react-barcode";
import Image from "next/image";
import logo from "../../../components/navbar/logo.png";

type Payment = {
  _id: string;
  amount: number;
  date: string;
  method: string;
  notes?: string;
};

type ScheduleItem = {
  date: string;
  shift: "Day" | "Night";
};

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      setLoading(true);
      try {
        const response = await fetch(`/api/event-managements/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!order?._id) return;
    setDownloading(true);

    try {
      const response = await fetch(`/api/invoices/${order._id}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setDownloading(false);
    }
  };

  const formatBDT = (amount: unknown) =>
    `BDT ${Number(amount || 0).toLocaleString("en-BD", { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-orange-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="py-20 text-center font-medium text-slate-500">
          Invoice not found.
        </div>
      </AdminLayout>
    );
  }

  const isPaid = !order.dueAmount || order.dueAmount <= 0;
  const invoiceId = `INV-${String(order._id).slice(-8).toUpperCase()}`;
  const schedule: ScheduleItem[] = Array.isArray(order.eventSchedule)
    ? order.eventSchedule
    : [];
  const finalAmount = Number(order.finalAmount ?? order.totalAmount - Number(order.discountAmount || 0));

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 print:hidden sm:flex-row sm:items-center">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-1 text-sm text-slate-600 hover:text-orange-600"
            >
              &larr; Back to Invoices
            </button>
            <h1 className="text-xl font-bold text-slate-900">Invoice Preview</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition active:scale-95 hover:bg-slate-200"
            >
              <FiPrinter />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition active:scale-95 hover:bg-orange-700 disabled:opacity-50"
            >
              <FiDownload className={downloading ? "animate-bounce" : ""} />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/10 bg-[#07111f] p-4 text-slate-100 shadow-[0_24px_90px_rgba(2,6,23,0.45)] sm:p-6">
          <div className="mb-5 rounded-[1.5rem] border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-4 shadow-inner sm:p-5">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_40px_rgba(0,0,0,0.45)]">
                  <Image src={logo} alt="Chitrojaal logo" width={72} height={72} className="h-[72px] w-[72px] rounded-xl object-contain" priority />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-300/90">Chitrojaal</p>
                  <h2 className="text-2xl font-black tracking-tight text-white">Invoice Preview</h2>
                  <p className="mt-1 text-sm text-slate-300">Creative production with schedule, discount, and payment tracking.</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Invoice</p>
                <p className="text-sm font-semibold text-white">{invoiceId}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white p-6 text-slate-800 shadow-lg sm:p-10">
            <div className="flex flex-col justify-between gap-4 border-b-2 border-orange-600 pb-6 sm:flex-row">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-orange-600">
                  CHITROJAAL
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Juma Market, Mizan Road, Feni 3900, Bangladesh
                </p>
                <p className="text-xs text-slate-500">
                  Phone: +880 1834-258375 | Web: www.chitrojaal.com
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <h3 className="text-2xl font-bold text-slate-900">INVOICE</h3>
                <div className="my-1 -mr-2">
                  <Barcode
                    value={invoiceId}
                    width={1.2}
                    height={32}
                    fontSize={10}
                    margin={0}
                    displayValue
                    lineColor="#0F172A"
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Issue Date: {new Date(order.createdAt || Date.now()).toLocaleDateString("en-BD")}
                </p>
                <p className="text-xs text-slate-500">
                  Event Date: {order.eventDate ? new Date(order.eventDate).toLocaleDateString("en-BD") : "N/A"}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
                  {isPaid ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                      <FiCheckCircle /> PAID IN FULL
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                      <FiClock /> PAYMENT PENDING
                    </span>
                  )}
                </div>
              </div>
            </div>

          <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                BILLED TO
              </h4>
              <p className="text-sm font-bold text-slate-900">
                {order.customerName || "Valued Client"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Contact: {order.customerPhone || "N/A"}
              </p>
              <p className="text-xs text-slate-600">
                Email: {order.customerEmail || "N/A"}
              </p>
              <p className="text-xs text-slate-600">
                Address: {order.customerAddress || "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                PROJECT DETAILS
              </h4>
              <p className="text-xs font-bold text-slate-900">
                Service Package: {order.package || "Custom Production"}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Program: {order.eventProgramType || "Main Program"}
                {order.otherEventName ? ` - ${order.otherEventName}` : ""}
              </p>
              <p className="text-xs text-slate-600">
                Discount: {formatBDT(order.discountAmount || 0)}
              </p>
              <p className="text-xs text-slate-600">
                Final Amount: {formatBDT(finalAmount)}
              </p>
              <p className="text-xs text-slate-600">
                Google Maps: {order.googleMapsLink || "N/A"}
              </p>
            </div>
          </div>

          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-200 text-left">
              <thead>
                <tr className="bg-orange-600 text-xs font-bold text-white">
                  <th className="p-3">Service & Deliverables Description</th>
                  <th className="p-3 text-center">Qty / Unit</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">
                      {order.package || "Creative Production Package"}
                    </p>
                    {schedule.length > 0 ? (
                      <p className="mt-1 text-slate-500">
                        Schedule:{" "}
                        {schedule
                          .map((item) =>
                            `${item.date ? new Date(item.date).toLocaleDateString("en-BD") : "N/A"} - ${item.shift} shift`,
                          )
                          .join(", ")}
                      </p>
                    ) : null}
                  </td>
                  <td className="p-3 text-center font-medium">1 Package</td>
                  <td className="p-3 text-right font-medium">
                    {formatBDT(order.totalAmount)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {formatBDT(order.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                PAYMENT INSTRUCTIONS & BANKING
              </h4>
              <p className="text-xs text-slate-700">
                Bank Name: Dutch Bangla Bank - DBBL (Feni Branch)
              </p>
              <p className="text-xs text-slate-700">
                Account Title: MD SALMAN HOSSAIN
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                Account No: 1407348737513
              </p>
              <p className="mt-1 text-xs text-slate-700">
                bKash / Nagad Wallet: +880 1834-258375 (Personal / Merchant)
              </p>
              <p className="mt-1 text-xs text-slate-400">Payment Ref: {invoiceId}</p>
            </div>

            <div className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatBDT(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied</span>
                  <span>- {formatBDT(order.discountAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Advance Paid</span>
                  <span>{formatBDT(order.paidAmount)}</span>
                </div>
                <div className="border-t border-orange-600 pt-2 flex justify-between text-sm font-bold text-slate-900">
                  <span className="text-orange-600">Total Due</span>
                  <span className="text-orange-600">
                    {formatBDT(order.dueAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {order.payments && order.payments.length > 0 ? (
            <div className="my-6 rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600">
                PAYMENT HISTORY
              </h4>
              <div className="space-y-2">
                {order.payments.map((payment: Payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {new Date(payment.date).toLocaleDateString("en-BD")} - {payment.method}
                      </p>
                      {payment.notes ? (
                        <p className="text-slate-500">{payment.notes}</p>
                      ) : null}
                    </div>
                    <p className="font-semibold text-slate-900">
                      {formatBDT(payment.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="my-6 rounded-lg border border-slate-200 bg-white p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600">
              TERMS AND CONDITIONS
            </h4>
            <ul className="space-y-1 text-[10px] leading-4 font-semibold text-slate-800">
              <li>Minimum 30% advance have to be paid for booking.</li>
              <li>90% Payment must be cleared when event is finished.</li>
              <li>No work will be done outside the time specified in the package details.</li>
              <li>Extra payment have to be paid for work and extra time.</li>
              <li>Images and videos captured by Chitrojaal can be shared across our social media channels.</li>
              <li>Final image and video delivery will be completed within 21-28 working days after the event.</li>
              <li>During the event, client has to provide us food and a proper place to rest at night.</li>
            </ul>
          </div>

            <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200 pt-6 text-[11px] text-slate-400 sm:flex-row">
              <p>Thank you for choosing Chitrojaal for your creative production.</p>
              <p>chitrojaal@gmail.com</p>
              <p>www.chitrojaal.com</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
