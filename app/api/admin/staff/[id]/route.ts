import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Staff from "@/models/Staff";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await mongooseConnect();
  try {
    const { id } = await params;
    await Staff.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting staff member", error);
    return NextResponse.json(
      { success: false, error: "Could not delete staff member" },
      { status: 500 },
    );
  }
}
