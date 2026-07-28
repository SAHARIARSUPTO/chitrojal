import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Payment from "@/models/Payment";
import Staff from "@/models/Staff";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

const FINANCE_METRIC_LABELS = ["Payment Received", "Due Payment"];

async function getSessionRole(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole || null;
}

export async function GET(request: Request) {
  await mongooseConnect();

  try {
    const role = await getSessionRole(request);
    const now = new Date();

    const [
      upcomingEvents,
      completedEventsCount,
      recentOrders,
      orderSummaries,
      totalStaff,
    ] = await Promise.all([
      Order.find({ status: { $in: ["Pending", "Approved"] }, eventDate: { $gte: now } })
        .sort({ eventDate: 1 })
        .limit(5)
        .lean(),
      Event.countDocuments({ status: "Completed" }),
      Order.find({}).sort({ eventDate: 1 }).limit(5).lean(),
      Order.find({}, "dueAmount paidAmount totalAmount").lean(),
      Staff.countDocuments(),
    ]);

    const paymentReceived = orderSummaries.reduce(
      (sum, order) => sum + (order.paidAmount || 0),
      0,
    );

    const duePayment = orderSummaries.reduce(
      (sum, order) => sum + (order.dueAmount || 0),
      0,
    );
    const dueOrderCount = orderSummaries.filter(
      (order) => (order.dueAmount || 0) > 0,
    ).length;

    const metrics = [
      {
        label: "Upcoming Events",
        value: upcomingEvents.length,
        kind: "count",
        detail: upcomingEvents[0]
          ? `${upcomingEvents[0].eventName} • ${new Date(upcomingEvents[0].eventDate).toLocaleDateString("en-BD", { dateStyle: "medium" })}`
          : "No upcoming events",
        icon: "calendar",
      },
      {
        label: "Events Done",
        value: completedEventsCount,
        kind: "count",
        detail:
          completedEventsCount === 0
            ? "No finished events yet"
            : `${completedEventsCount} events completed`,
        icon: "check",
      },
      {
        label: "Payment Received",
        value: paymentReceived,
        kind: "currency",
        detail: `${orderSummaries.length} orders tracked`,
        icon: "dollar",
      },
      {
        label: "Due Payment",
        value: duePayment,
        kind: "currency",
        detail: `${dueOrderCount} order${dueOrderCount === 1 ? "" : "s"} still pending`,
        icon: "clock",
      },
      {
        label: "Total Staff",
        value: totalStaff,
        kind: "count",
        detail: `${totalStaff} staff members`,
        icon: "users",
      },
    ].filter((metric) =>
      role === "staff" ? !FINANCE_METRIC_LABELS.includes(metric.label) : true,
    );

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        accessRole: role || "admin",
        upcomingEvents: upcomingEvents.map((event) => ({
          ...event,
          name: event.eventName,
        })),
        recentOrders: recentOrders.map((order) => ({
          ...order,
          eventDate: order.eventDate
            ? new Date(order.eventDate).toISOString()
            : null,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
