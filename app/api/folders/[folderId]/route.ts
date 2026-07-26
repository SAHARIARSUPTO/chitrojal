import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Folder from "@/models/Folder";

// GET a single folder by ID
export async function GET(request: Request, context: any) {
  await mongooseConnect();
  try {
    const { folderId } = await context.params;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }
    return NextResponse.json(folder);
  } catch (error) {
    console.error("Error fetching folder:", error);
    return NextResponse.json({ error: "Error fetching folder" }, { status: 500 });
  }
}
