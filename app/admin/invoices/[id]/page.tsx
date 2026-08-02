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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
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

  useEffect(() => {
    if (!order?._id) return;
    loadPdfPreview();

    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [order]);

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

  const loadPdfPreview = async () => {
    if (!order?._id) return;
    setPdfLoading(true);

    try {
      const response = await fetch(`/api/invoices/${order._id}`);
      if (!response.ok) throw new Error("Failed to generate PDF preview");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error loading PDF preview:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  const formatBDT = (amount: unknown) =>
    `BDT ${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
    })}`;

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
  const finalAmount = Number(
    order.finalAmount ?? order.totalAmount - Number(order.discountAmount || 0),
  );

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
            <h1 className="text-xl font-bold text-slate-900">
              Invoice Preview
            </h1>
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
                  <Image
                    src={logo}
                    alt="Chitrojaal logo"
                    width={110}
                    height={80}
                    className=" rounded-xl object-contain"
                    priority
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-orange-300/90">
                    Chitrojaal
                  </p>
                  <h2 className="text-2xl font-black tracking-tight text-white">
                    Invoice Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Creative production with schedule, discount, and payment
                    tracking.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Invoice
                </p>
                <p className="text-sm font-semibold text-white">{invoiceId}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-3 text-slate-100 shadow-inner">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  PDF Preview
                </p>
                <p className="text-sm text-slate-200">
                  Embedded invoice generated from the same backend PDF API.
                </p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
              >
                <FiDownload className={downloading ? "animate-bounce" : ""} />
                {downloading ? "Generating PDF..." : "Download PDF"}
              </button>
            </div>
            <div className="min-h-[480px] rounded-3xl overflow-hidden border border-white/10 bg-black">
              {pdfLoading ? (
                <div className="flex h-full items-center justify-center bg-slate-950 text-slate-300">
                  Loading preview...
                </div>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  className="h-[520px] w-full"
                  title="Invoice PDF Preview"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-950 text-slate-300">
                  Unable to load PDF preview.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
