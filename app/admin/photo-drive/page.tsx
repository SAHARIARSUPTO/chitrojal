"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import { FiEdit2, FiLink, FiPlus, FiTrash2 } from "react-icons/fi";

type DriveLink = {
  _id: string;
  title: string;
  link: string;
  clientName?: string;
  eventName?: string;
  accessLevel?: string;
  notes?: string;
  status?: string;
};

export default function PhotoDrivePage() {
  const [links, setLinks] = useState<DriveLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<DriveLink | null>(null);
  const [form, setForm] = useState({
    title: "",
    link: "",
    clientName: "",
    eventName: "",
    accessLevel: "Client",
    notes: "",
  });

  const loadLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/photo-drive");
      const result = await response.json();
      if (response.ok) {
        setLinks(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/photo-drive", {
        method: editingLink ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editingLink ? { _id: editingLink._id } : {}),
          ...form,
        }),
      });
      if (response.ok) {
        setForm({
          title: "",
          link: "",
          clientName: "",
          eventName: "",
          accessLevel: "Client",
          notes: "",
        });
        setEditingLink(null);
        loadLinks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (link: DriveLink) => {
    setEditingLink(link);
    setForm({
      title: link.title,
      link: link.link,
      clientName: link.clientName || "",
      eventName: link.eventName || "",
      accessLevel: link.accessLevel || "Client",
      notes: link.notes || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this link?")) return;
    try {
      const response = await fetch(`/api/admin/photo-drive/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadLinks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold">Photo Drive Links</h1>
            <p className="text-sm text-neutral-400 mt-2">
              Store and manage shared client photo-drive access links from one
              place.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <h2 className="text-xl font-semibold mb-4">Create Link</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                required
              />
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                required
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  placeholder="Client name"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                />
                <input
                  value={form.eventName}
                  onChange={(e) =>
                    setForm({ ...form, eventName: e.target.value })
                  }
                  placeholder="Event name"
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={form.accessLevel}
                  onChange={(e) =>
                    setForm({ ...form, accessLevel: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
                >
                  <option>Client</option>
                  <option>Admin</option>
                  <option>Vendor</option>
                </select>
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
                <FiPlus /> {editingLink ? "Update link" : "Save link"}
              </button>
            </form>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-[#0A0A0A]/80 p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Links</h2>
            {loading ? (
              <p className="text-sm text-neutral-400">Loading links...</p>
            ) : links.length === 0 ? (
              <p className="text-sm text-neutral-400">No links yet.</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link._id}
                    className="rounded-xl border border-white/10 bg-[#050505] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-white">
                          {link.title}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          {link.clientName || "Client"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(link)}
                          className="rounded-lg border border-white/10 p-2"
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="rounded-lg border border-white/10 p-2"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center gap-2 text-sm text-orange-400"
                    >
                      <FiLink /> Open link
                    </a>
                    {link.notes ? (
                      <p className="mt-2 text-sm text-neutral-400">
                        {link.notes}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
