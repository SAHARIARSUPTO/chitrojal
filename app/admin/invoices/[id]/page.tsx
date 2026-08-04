"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "../../../components/home/AdminLayout";
import { FiDownload, FiFileText } from "react-icons/fi";
import Image from "next/image";
import logo from "../../../components/navbar/logo.png";

type ScheduleItem = {
  date: string;
  shift: "Day" | "Night";
};

type InvoiceOrder = {
  _id: string;
  dueAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  paidAmount?: number;
  finalAmount?: number;
  eventSchedule?: ScheduleItem[];
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerAddress?: string;
  package?: string;
  eventDate?: string;
  createdAt?: string;
};

export default function InvoicePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<InvoiceOrder | null>(null);
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

  const getInvoiceUrl = (mode: "preview" | "download") => {
    if (!order?._id) return null;
    const baseUrl = `/api/invoices/${order._id}`;
    const params = new URLSearchParams();

    if (mode === "download") {
      params.set("download", "1");
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const handleDownloadPDF = async () => {
    if (!order?._id) return;
    setDownloading(true);

    const invoiceUrl = getInvoiceUrl("download");
    if (!invoiceUrl) {
      setDownloading(false);
      return;
    }

    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open(invoiceUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const response = await fetch(invoiceUrl, { cache: "no-store" });
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
      window.open(invoiceUrl, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  const previewSrc = order?._id
    ? `${
        getInvoiceUrl("preview") || `/api/invoices/${order._id}`
      }#view=FitH&toolbar=1&navpanes=0`
    : null;

  const handlePreviewPDF = () => {
    const invoiceUrl = getInvoiceUrl("preview");
    if (!invoiceUrl) return;
    window.open(invoiceUrl, "_blank", "noopener,noreferrer");
  };

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

  const invoiceId = `INV-${String(order._id).slice(-8).toUpperCase()}`;

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
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePreviewPDF}
              className="flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 transition active:scale-95 hover:bg-orange-500/20"
            >
              <FiFileText />
              Open PDF
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

        <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={logo}
              alt="ChitroJaal logo"
              width={88}
              height={64}
              className="h-14 w-auto object-contain"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-orange-500/80">
                ChitroJaal
              </p>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Invoice Preview
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Creative production with schedule, discount, and payment
                tracking.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Invoice
            </p>
            <p className="text-sm font-semibold text-slate-900">{invoiceId}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3 print:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              PDF Preview
            </p>
            <p className="text-sm text-slate-600">
              Embedded invoice generated from the same backend PDF API.
            </p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
          >
            <FiDownload className={downloading ? "animate-bounce" : ""} />
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>

        <div className="min-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {previewSrc ? (
            <>
              <iframe
                src={previewSrc}
                className="hidden h-[70vh] w-full sm:block"
                title="Invoice PDF Preview"
              />
              <object
                data={previewSrc}
                type="application/pdf"
                className="block h-[70vh] w-full sm:hidden"
              >
                <div className="flex h-full items-center justify-center bg-slate-50 px-6 text-center text-slate-500">
                  Your browser cannot display the PDF inline. Use Open PDF or
                  Download PDF instead.
                </div>
              </object>
            </>
          ) : (
            <div className="flex h-[70vh] items-center justify-center bg-slate-50 text-slate-500">
              Unable to load PDF preview.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
