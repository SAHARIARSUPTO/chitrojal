import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const STAFF_COLLECTION = "staff";

export async function GET() {
  try {
    const { db } = await dbConnect();
    const staff = await db
      .collection(STAFF_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await dbConnect();
    const body = await request.json();

    const newStaffMember = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection(STAFF_COLLECTION)
      .insertOne(newStaffMember);
    return NextResponse.json(
      { success: true, data: { ...newStaffMember, _id: result.insertedId } },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating staff member:", error);
    return NextResponse.json(
      { success: false, error: "Bad Request" },
      { status: 400 },
    );
  }
}
