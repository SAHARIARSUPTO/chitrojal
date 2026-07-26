import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Event from "@/models/Event";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const event = await Event.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("Error updating event", error);
    return NextResponse.json(
      { success: false, error: "Could not update event" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    await Event.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event", error);
    return NextResponse.json(
      { success: false, error: "Could not delete event" },
      { status: 500 },
    );
  }
}
