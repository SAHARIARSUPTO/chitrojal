"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/home/AdminLayout";
import { FiCalendar, FiEdit2, FiEye, FiSearch, FiTrash2 } from "react-icons/fi";

const statusConfig = {
  Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Approved: "text-green-400 bg-green-400/10 border-green-400/20",
  Ongoing: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

type EventStatus = keyof typeof statusConfig;

interface EventItem {
  _id: string;
  name: string;
  clientName: string;
  date: string;
  location?: string;
  status: EventStatus;
  totalAmount?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState({
    name: "",
    status: "Pending" as EventStatus,
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/events");
      const result = await response.json();
      if (response.ok) {
        setEvents(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const query = searchTerm.toLowerCase();
    return (
      event.name.toLowerCase().includes(query) ||
      event.clientName.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query)
    );
  });

  const openEdit = (event: EventItem) => {
    setEditingEvent(event);
    setForm({ name: event.name, status: event.status });
  };

  const handleSave = async () => {
    if (!editingEvent) return;
    try {
      const response = await fetch(`/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, status: form.status }),
      });
      if (response.ok) {
        setEditingEvent(null);
        fetchEvents();
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      const response = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="relative max-w-7xl mx-auto space-y-8 pb-12 text-neutral-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Events</h1>
            <p className="text-neutral-400 mt-2 text-sm">
              Upcoming bookings appear here automatically and can be updated by
              the admin.
            </p>
          </div>
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-4 sm:p-6 shadow-lg">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search events by client or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-[#050505] text-white"
            />
          </div>
        </div>

        <div className="relative z-10 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="py-20 text-center text-neutral-400">
              Loading events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-20 text-center text-neutral-400">
              No events found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#050505]/80 border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-5 pl-6">Event</th>
                    <th className="p-5">Client</th>
                    <th className="p-5">Date</th>
                    <th className="p-5">Location</th>
                    <th className="p-5">Status</th>
                    <th className="p-5 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEvents.map((event) => (
                    <tr
                      key={event._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5 pl-6 font-semibold text-white">
                        {event.name}
                      </td>
                      <td className="p-5 text-neutral-300">
                        {event.clientName}
                      </td>
                      <td className="p-5 text-neutral-300">
                        {new Date(event.date).toLocaleDateString("en-BD")}
                      </td>
                      <td className="p-5 text-neutral-300">
                        {event.location || "—"}
                      </td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border inline-block ${statusConfig[event.status] || statusConfig.Pending}`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(event)}
                            className="p-2 rounded-lg border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="p-2 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editingEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-[1.5rem] border border-white/10 bg-[#0A0A0A] p-6">
            <h2 className="text-xl font-semibold mb-4">Edit event</h2>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
            />
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as EventStatus })
              }
              className="mt-4 w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-3"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingEvent(null)}
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
