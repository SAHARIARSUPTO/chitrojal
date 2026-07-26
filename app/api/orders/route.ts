// app/api/orders/route.ts
import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Event from "@/models/Event";

export async function GET() {
  await mongooseConnect();
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error fetching orders" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      eventDate,
      package: packageName,
      totalAmount,
    } = body;

    if (
      !customerName ||
      !customerPhone ||
      !eventDate ||
      !packageName ||
      !totalAmount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const parsedTotal = Number(totalAmount || 0);
    const parsedAdvance = Number(body.advanceAmount || 0);
    const parsedPaid = Number(body.paidAmount || 0);

    const newOrder = await Order.create({
      ...body,
      eventDate: new Date(eventDate),
      totalAmount: parsedTotal,
      advanceAmount: parsedAdvance,
      paidAmount: parsedPaid,
      dueAmount: parsedTotal - parsedPaid,
      status: body.status || "Pending",
      createdFromBooking: Boolean(body.createdFromBooking),
    });

    await Event.create({
      name: body.eventName || `${customerName} - ${packageName}`,
      type: packageName,
      date: new Date(eventDate),
      location: body.eventLocation || body.customerAddress || "",
      clientName: customerName,
      clientEmail: body.customerEmail || "",
      contactNumber: customerPhone,
      totalAmount: parsedTotal,
      notes: body.notes || "",
      bookingSource: body.bookingSource || "Admin",
      googleMapsLink: body.googleMapsLink || "",
      orderId: newOrder._id,
      createdFromBooking: Boolean(body.createdFromBooking),
      status: "Pending",
    });

    return NextResponse.json(
      { success: true, data: newOrder },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 },
    );
  }
}
