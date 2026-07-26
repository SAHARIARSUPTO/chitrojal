import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Event from "@/models/Event";

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();

    const customerName = body.customerName || body.name || "";
    const customerPhone = body.customerPhone || body.phone || "";
    const customerEmail = body.customerEmail || body.email || "";
    const customerAddress = body.customerAddress || body.address || "";
    const eventLocation =
      body.eventLocation || body.location || customerAddress;
    const eventDate = body.eventDate || body.bookingDate;
    const packageName =
      body.package || body.selectedPackage || body.eventType || "Not specified";
    const packageDetails = body.packageDetails || body.message || "";
    const totalAmount = Number(body.totalAmount || body.amount || 0);
    const parsedAdvance = Number(body.advanceAmount || body.advance || 0);
    const parsedPaid = Number(body.paidAmount || body.paid || 0);

    if (!customerName || !customerPhone || !customerEmail || !eventDate) {
      return NextResponse.json(
        { message: "Required fields are missing." },
        { status: 400 },
      );
    }

    const newOrder = await Order.create({
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      eventDate: new Date(eventDate),
      eventLocation,
      eventName: body.eventName || `${customerName} - ${packageName}`,
      package: packageName,
      packageDetails,
      googleMapsLink: body.googleMapsLink || "",
      bookingSource: body.bookingSource || "Website",
      notes: body.notes || body.message || "",
      totalAmount,
      advanceAmount: parsedAdvance,
      paidAmount: parsedPaid,
      dueAmount: totalAmount - parsedPaid,
      status: "Pending",
      createdFromBooking: true,
    });

    await Event.create({
      name: newOrder.eventName || `${customerName} - ${packageName}`,
      type: packageName,
      date: newOrder.eventDate,
      location: eventLocation,
      clientName: customerName,
      clientEmail: customerEmail,
      contactNumber: customerPhone,
      totalAmount,
      notes: newOrder.notes,
      bookingSource: newOrder.bookingSource,
      googleMapsLink: newOrder.googleMapsLink,
      orderId: newOrder._id,
      createdFromBooking: true,
      status: "Pending",
    });

    return NextResponse.json(
      {
        message: "Booking request received successfully!",
        bookingId: newOrder._id,
        orderId: newOrder._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking request failed:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
