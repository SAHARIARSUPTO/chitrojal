import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import PhotoDriveLink from "@/models/PhotoDriveLink";

export async function GET() {
  await mongooseConnect();

  try {
    const links = await PhotoDriveLink.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: links });
  } catch (error) {
    console.error("Error loading photo drive links", error);
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
    const link = await PhotoDriveLink.create(body);
    return NextResponse.json({ success: true, data: link }, { status: 201 });
  } catch (error) {
    console.error("Error creating photo drive link", error);
    return NextResponse.json(
      { success: false, error: "Could not save link" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  await mongooseConnect();
  try {
    const body = await request.json();
    const { _id, ...updates } = body;
    const link = await PhotoDriveLink.findByIdAndUpdate(_id, updates, {
      new: true,
    });
    return NextResponse.json({ success: true, data: link });
  } catch (error) {
    console.error("Error updating photo drive link", error);
    return NextResponse.json(
      { success: false, error: "Could not update link" },
      { status: 500 },
    );
  }
}
