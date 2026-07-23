import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

const EVENTS_COLLECTION = "events";

export async function GET() {
  try {
    const { db } = await dbConnect();
    const events = await db
      .collection(EVENTS_COLLECTION)
      .find({})
      .sort({ date: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}
