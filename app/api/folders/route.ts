import { NextResponse } from "next/server";
import mongooseConnect from "@/lib/mongoose";
import Folder from "@/models/Folder";

// GET all folders
export async function GET() {
  await mongooseConnect();
  try {
    const folders = await Folder.find({});
    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json({ error: "Error fetching folders" }, { status: 500 });
  }
}

// POST a new folder
export async function POST(request: Request) {
  await mongooseConnect();
  try {
    const { name } = await request.json();
    const newFolder = await Folder.create({ name });
    return NextResponse.json(newFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json({ error: "Error creating folder" }, { status: 500 });
  }
}
