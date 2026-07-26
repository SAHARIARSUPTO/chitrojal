import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Event from "@/models/Event";

export async function GET() {
  await mongooseConnect();
  try {
    const events = await Event.find({}).sort({ date: 1 }).lean();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const event = await Event.create({
      ...body,
      date: body.date ? new Date(body.date) : new Date(),
      status: body.status || "Pending",
    });
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Could not create event" },
      { status: 500 },
    );
  }
}
