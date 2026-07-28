"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import { FiDownload, FiCheckCircle, FiClock, FiPrinter } from "react-icons/fi";
import Barcode from "react-barcode";

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      async function fetchOrder() {
        setLoading(true);
        try {
          const response = await fetch(`/api/event-managements/${id}`);
          if (response.ok) {
            const data = await response.json();
            setOrder(data);
          }
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
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

  const formatBDT = (amount: number) =>
    `BDT ${amount ? amount.toLocaleString("en-BD", { minimumFractionDigits: 2 }) : "0.00"}`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-20 text-slate-500 font-medium">
          Invoice not found.
        </div>
      </AdminLayout>
    );
  }

  const isPaid = !order.dueAmount || order.dueAmount <= 0;
  const invoiceId = `INV-${String(order._id).slice(-8).toUpperCase()}`;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
          <div>
            <button
              onClick={() => router.back()}
              className="text-sm text-slate-600 hover:text-orange-600 mb-1"
            >
              &larr; Back to Invoices
            </button>
            <h1 className="text-xl font-bold text-slate-900">
              Invoice Preview
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all border border-slate-300"
            >
              <FiPrinter />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50"
            >
              <FiDownload className={downloading ? "animate-bounce" : ""} />
              {downloading ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Invoice Card UI */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-10 text-slate-800">
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b-2 border-orange-600">
            <div>
              <h2 className="text-3xl font-extrabold text-orange-600 tracking-tight">
                CHITROJAAL
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Juma Market, Mizan Road, Feni 3900, Bangladesh
              </p>
              <p className="text-xs text-slate-500">
                Phone: +880 1834-258375 | Web: www.chitrojaal.com
              </p>
            </div>

            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <h3 className="text-2xl font-bold text-slate-900">INVOICE</h3>

              {/* Barcode UI */}
              <div className="my-1 -mr-2">
                <Barcode
                  value={invoiceId}
                  width={1.2}
                  height={32}
                  fontSize={10}
                  margin={0}
                  displayValue={true}
                  lineColor="#0F172A"
                />
              </div>

              <p className="text-xs text-slate-500">
                Issue Date:{" "}
                {new Date(order.createdAt || Date.now()).toLocaleDateString(
                  "en-BD",
                )}
              </p>
              <p className="text-xs text-slate-500">
                Event Date:{" "}
                {order.eventDate
                  ? new Date(order.eventDate).toLocaleDateString("en-BD")
                  : "N/A"}
              </p>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold sm:justify-end">
                {isPaid ? (
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <FiCheckCircle /> PAID IN FULL
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <FiClock /> PAYMENT PENDING
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Operational Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                BILLED TO
              </h4>
              <p className="font-bold text-slate-900 text-sm">
                {order.customerName || "Valued Client"}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Contact: {order.customerPhone || "N/A"}
              </p>
              <p className="text-xs text-slate-600">
                Email: {order.customerEmail || "N/A"}
              </p>
              <p className="text-xs text-slate-600">
                Address: {order.customerAddress || "N/A"}
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
              <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                PROJECT DETAILS
              </h4>
              <p className="text-xs font-bold text-slate-900">
                Service Package: {order.package || "Custom Production"}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Payment Method: {order.paymentMethod || "Bank Transfer / MFS"}
              </p>
              <p className="text-xs text-slate-600">
                Lead Studio Unit: Chitrojaal Media Lab
              </p>
              <p className="text-xs text-slate-600">
                Coverage Area: Feni & Regional Operations
              </p>
            </div>
          </div>

          {/* Deliverables Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-orange-600 text-white text-xs font-bold">
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
                    <p className="text-slate-500 mt-0.5">
                      Includes high-resolution photographic coverage, cinematic
                      editing, color grading, and digital gallery distribution.
                    </p>
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

          {/* Financials & Banking Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className="border border-slate-200 p-4 rounded-lg bg-white">
              <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                PAYMENT INSTRUCTIONS & BANKING
              </h4>
              <p className="text-xs text-slate-700">
                Bank Name: Dutch Bangla Bank - DBBL (Feni Branch)
              </p>
              <p className="text-xs text-slate-700">
                Account Title: MD SALMAN HOSSAIN
              </p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                Account No: 1407348737513
              </p>
              <p className="text-xs text-slate-700 mt-1">
                bKash / Nagad Wallet: +880 1834-258375 (Personal / Merchant)
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Payment Ref: {invoiceId}
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-lg bg-slate-50 flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatBDT(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Advance Paid</span>
                  <span>{formatBDT(order.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Discount Applied</span>
                  <span>- BDT 0.00</span>
                </div>
                <div className="border-t border-orange-600 pt-2 flex justify-between font-bold text-sm text-slate-900">
                  <span className="text-orange-600">Total Due</span>
                  <span className="text-orange-600">
                    {formatBDT(order.dueAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="border border-slate-200 p-4 rounded-lg bg-white my-6">
            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              TERMS AND CONDITIONS
            </h4>
            <ol className="text-[11px] text-slate-800 font-semibold space-y-1 list-decimal list-inside">
              <li>Minimum 30% advance have to be paid for booking.</li>
              <li>90% Payment must be cleared when event is finished.</li>
              <li>
                No work will be done outside the time specified in the package
                details.
              </li>
              <li>Extra payment have to be paid for work and extra time.</li>
              <li>
                Images and videos captured by Chitrajol can be uploaded to their
                own Facebook page.
              </li>
              <li>
                This agreement can be cancelled before 7 days of service date
                otherwise advance money <br />
                <span className="font-normal text-slate-600 pl-4">
                  will not be refunded.
                </span>
              </li>
              <li>
                During the event, client has to provide us food and a proper
                place to Rest at night.
              </li>
            </ol>
          </div>

          {/* Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
            <p>
              Thank you for choosing Chitrojaal for your creative production.
            </p>
            <p>chitrojaal@gmail.com</p>
            <p>www.chitrojaal.com</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
