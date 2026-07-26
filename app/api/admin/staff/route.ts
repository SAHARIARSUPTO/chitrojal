import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

export async function GET() {
  await mongooseConnect();
  try {
    const staff = await Staff.find({}).sort({ createdAt: -1 });
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
  await mongooseConnect();
  try {
    const body = await request.json();
    const newStaffMember = new Staff({
      ...body,
      updatedAt: new Date(),
    });
    await newStaffMember.save();
    return NextResponse.json(
      { success: true, data: newStaffMember },
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

export async function PUT(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const { _id, ...updates } = body;
    const updatedStaff = await Staff.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error("Error updating staff member:", error);
    return NextResponse.json(
      { success: false, error: "Bad Request" },
      { status: 400 },
    );
  }
}
