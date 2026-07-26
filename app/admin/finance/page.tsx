"use client";

import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import {
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

type FinanceSummary = {
  income: number;
  expenditure: number;
  outstanding: number;
  expenses: Array<{
    _id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
    vendor?: string;
  }>;
  orders: Array<{
    _id: string;
    customerName: string;
    package: string;
    dueAmount: number;
    totalAmount: number;
  }>;
};

const formatCurrency = (value: number) => `৳${value.toLocaleString("en-BD")}`;

export default function FinancePage() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("");
  const [editingExpense, setEditingExpense] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "",
    category: "Operations",
    amount: "",
    vendor: "",
    notes: "",
  });

  const loadSummary = async (selectedMonth = month) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/finance?month=${selectedMonth}`);
      const result = await response.json();
      if (response.ok) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/finance", {
        method: editingExpense ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingExpense ? { _id: editingExpense._id } : {}),
          ...form,
          amount: Number(form.amount),
        }),
      });
      if (response.ok) {
        setForm({
          title: "",
          category: "Operations",
          amount: "",
          vendor: "",
          notes: "",
        });
        setEditingExpense(null);
        loadSummary();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (expense: any) => {
    setEditingExpense(expense);
    setForm({
      title: expense.title,
      category: expense.category || "Operations",
      amount: expense.amount?.toString() || "",
      vendor: expense.vendor || "",
      notes: expense.notes || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const response = await fetch(`/api/admin/finance/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadSummary();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const balance = useMemo(
    () => (summary ? summary.income - summary.expenditure : 0),
    [summary],
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold">Finance Overview</h1>
            <p className="text-sm text-neutral-400 mt-2">
              Track monthly income, expenses, and outstanding balances from the
              same admin dashboard.
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
            />
            <button
              onClick={() => loadSummary(month)}
              className="rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white"
            >
              Load
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <div className="mb-4 flex items-center gap-2 text-orange-400">
              <FiTrendingUp /> Income
            </div>
            <div className="text-3xl font-bold">
              {summary ? formatCurrency(summary.income) : "—"}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <div className="mb-4 flex items-center gap-2 text-amber-400">
              <FiTrendingDown /> Expenditure
            </div>
            <div className="text-3xl font-bold">
              {summary ? formatCurrency(summary.expenditure) : "—"}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-400">
              <FiDollarSign /> Net
            </div>
            <div className="text-3xl font-bold">
              {summary ? formatCurrency(balance) : "—"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <h2 className="text-xl font-semibold mb-4">Record expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Expense title"
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                >
                  <option>Operations</option>
                  <option>Marketing</option>
                  <option>Equipment</option>
                  <option>Staff</option>
                  <option>Travel</option>
                </select>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Amount"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="Vendor"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                />
                <input
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Notes"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white"
              >
                <FiPlus /> {editingExpense ? "Update expense" : "Save expense"}
              </button>
            </form>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <h2 className="text-xl font-semibold mb-4">Recent expenses</h2>
            {loading ? (
              <p className="text-sm text-neutral-400">
                Loading financial records...
              </p>
            ) : summary?.expenses.length ? (
              <div className="space-y-3">
                {summary.expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="rounded-xl border border-white/10 bg-[#050505] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">
                          {expense.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {expense.vendor || expense.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(expense.date).toLocaleDateString("en-BD")}
                        </p>
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(expense)}
                            className="rounded-lg border border-white/10 p-1.5"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="rounded-lg border border-white/10 p-1.5"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                No expenses recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
