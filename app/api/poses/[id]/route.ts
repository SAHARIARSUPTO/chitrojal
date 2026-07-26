// app/api/poses/[id]/route.ts
import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Pose from "@/models/Pose";

export async function DELETE(request: Request, context: any) {
  await mongooseConnect();
  try {
    const { id } = await context.params;
    const deletedPose = await Pose.findByIdAndDelete(id);

    if (!deletedPose) {
      return NextResponse.json({ error: "Pose not found" }, { status: 404 });
    }

    // Optionally, you might want to delete the images from Cloudinary as well.
    // This would require more logic and the Cloudinary SDK.
    // For now, we are just deleting the reference from the database.

    return NextResponse.json({ message: "Pose deleted successfully" });
  } catch (error) {
    console.error("Error deleting pose:", error);
    return NextResponse.json({ error: "Error deleting pose" }, { status: 500 });
  }
}
