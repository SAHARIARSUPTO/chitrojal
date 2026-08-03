"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import { formatDateKey, parseDateValue } from "@/lib/date-utils";

type EventScheduleEntry = {
  date?: string | Date | null;
  shift?: string | null;
};

export type UpcomingEventItem = {
  _id?: string;
  name?: string;
  eventName?: string;
  customerName?: string;
  eventDate?: string | Date | null;
  eventSchedule?: EventScheduleEntry[];
  eventLocation?: string;
  status?: string;
  eventProgramType?: string;
};

type UpcomingEventsPanelProps = {
  events: UpcomingEventItem[];
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  emptyLabel?: string;
  compact?: boolean;
};

type NormalizedUpcomingEvent = UpcomingEventItem & {
  primaryDate: Date;
  eventLabel: string;
  shift: string;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatDay = (date: Date) =>
  new Intl.DateTimeFormat("en", { day: "numeric" }).format(date);

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);

const getPrimaryDate = (event: UpcomingEventItem) => {
  const scheduleDate = event.eventSchedule?.[0]?.date;
  const dateValue = scheduleDate || event.eventDate;
  return parseDateValue(dateValue);
};

export default function UpcomingEventsPanel({
  events,
  title = "Calendar & Upcoming Events",
  description = "A quick calendar view of upcoming shoots and bookings.",
  actionHref = "/admin/event-managements",
  actionLabel = "Open Booking Management",
  emptyLabel = "No upcoming events found.",
  compact = false,
}: UpcomingEventsPanelProps) {
  const normalizedEvents = useMemo(() => {
    return events
      .map((event) => {
        const primaryDate = getPrimaryDate(event);
        return {
          ...event,
          primaryDate,
          eventLabel:
            event.name || event.eventName || event.customerName || "Untitled Event",
          shift: event.eventSchedule?.[0]?.shift || "Day",
        } as NormalizedUpcomingEvent;
      })
      .filter((event): event is NormalizedUpcomingEvent => Boolean(event.primaryDate))
      .sort(
        (left, right) =>
          (left.primaryDate?.getTime() ?? 0) - (right.primaryDate?.getTime() ?? 0),
      );
  }, [events]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const resetToday = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPadding = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const eventMap = useMemo(() => {
    const map = new Map<string, Array<NormalizedUpcomingEvent>>();
    normalizedEvents.forEach((event) => {
      const primaryDate = event.primaryDate as Date;
      if (!primaryDate) return;
      const key = formatDateKey(primaryDate);
      const current = map.get(key) || [];
      current.push(event);
      map.set(key, current);
    });
    return map;
  }, [normalizedEvents]);

  const calendarCells = [
    ...Array.from({ length: startPadding }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        index + 1,
      );
      return date;
    }),
  ];

  const upcomingList = normalizedEvents.slice(0, compact ? 4 : 6);

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-4 shadow-2xl sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-orange-500/20 bg-orange-500/10 p-2 text-orange-500">
                <FiCalendar />
              </span>
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">{title}</h2>
                <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-neutral-300 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-white"
                title="Previous Month"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-bold tracking-wide text-white">
                {formatMonth(monthStart)}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-neutral-300 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-white"
                title="Next Month"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={resetToday}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-orange-400 transition-colors hover:bg-orange-500/10"
              >
                Today
              </button>
            </div>
            <span className="text-xs font-semibold text-neutral-400">
              {normalizedEvents.length} total events
            </span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="pb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500"
              >
                {label}
              </div>
            ))}
            {calendarCells.map((date, index) => {
              if (!date) {
                return <div key={`blank-${index}`} className="min-h-16 rounded-xl bg-white/[0.02]" />;
              }

              const dayEvents = eventMap.get(formatDateKey(date)) || [];
              const primaryEvent = dayEvents[0];
              const isToday = formatDateKey(date) === formatDateKey(new Date());

              return (
                <div
                  key={date.toISOString()}
                  className={`min-h-16 rounded-xl border p-2 transition-colors ${
                    dayEvents.length > 0
                      ? "border-orange-500/25 bg-orange-500/10"
                      : "border-white/5 bg-white/[0.02]"
                  } ${isToday ? "ring-1 ring-orange-500/40" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-white">
                      {formatDay(date)}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="rounded-full bg-orange-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-orange-300">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  {primaryEvent ? (
                    <div className="mt-1 space-y-0.5">
                      <p className="truncate text-[10px] font-semibold text-white">
                        {primaryEvent.eventLabel}
                      </p>
                      <p className="truncate text-[9px] text-neutral-300">
                        {primaryEvent.shift} shift
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#0A0A0A]/80 p-4 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white sm:text-lg">Upcoming Events</h3>
            <p className="text-xs leading-relaxed text-neutral-400 sm:text-sm">
              The next booked events in time order.
            </p>
          </div>
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white transition-colors hover:border-orange-500/30 hover:bg-white/[0.08]"
          >
            {actionLabel} <FiChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 space-y-2">
          {upcomingList.length > 0 ? (
            upcomingList.map((event) => (
              <div
                key={event._id || `${event.eventLabel}-${event.eventDate}`}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {event.eventLabel}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-400">
                      {event.primaryDate?.toLocaleDateString("en-BD", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      {event.eventLocation ? (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <FiMapPin className="h-3 w-3" />
                          {event.eventLocation}
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[10px] font-semibold text-orange-300">
                    {event.shift}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-neutral-400">
              {emptyLabel}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
