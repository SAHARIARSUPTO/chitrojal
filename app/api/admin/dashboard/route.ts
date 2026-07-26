import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Payment from "@/models/Payment";

export async function GET() {
  await mongooseConnect();

  try {
    const now = new Date();

    const [
      upcomingEvents,
      completedEventsCount,
      recentOrders,
      orderSummaries,
      paymentDocs,
    ] = await Promise.all([
      Event.find({
        date: { $gte: now },
        status: { $nin: ["Completed", "Done", "Cancelled"] },
      })
        .sort({ date: 1 })
        .limit(5)
        .lean(),
      Event.countDocuments({
        $or: [
          { status: { $in: ["Completed", "Done", "Finished"] } },
          { date: { $lt: now } },
        ],
      }),
      Order.find({}).sort({ eventDate: 1 }).limit(5).lean(),
      Order.find({}, "dueAmount paidAmount totalAmount").lean(),
      Payment.find({}, "amount").lean(),
    ]);

    const paymentReceived =
      paymentDocs.length > 0
        ? paymentDocs.reduce((sum, payment) => sum + (payment.amount || 0), 0)
        : orderSummaries.reduce(
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
          ? `${upcomingEvents[0].name} • ${new Date(upcomingEvents[0].date).toLocaleDateString("en-BD", { dateStyle: "medium" })}`
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
    ];

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        upcomingEvents: upcomingEvents.map((event) => ({
          ...event,
          date: event.date ? new Date(event.date).toISOString() : null,
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
