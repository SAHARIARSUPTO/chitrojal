import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getSessionTokenFromRequest, verifySessionToken } from "@/lib/session";

const BENTO_FOLDERS = [
  "portfolio",
  "portrait-library",
  "landscape-library",
  "package",
] as const;

type BentoFolder = (typeof BENTO_FOLDERS)[number];

export type AnimationType = "fade" | "zoom" | "slide" | "slideUp" | "blur";

export interface BentoCategorySettings {
  intervalDuration: number;
  animationType: AnimationType;
}

export type BentoSettings = Record<BentoFolder, BentoCategorySettings>;

const DEFAULT_SETTINGS: BentoSettings = {
  portfolio: { intervalDuration: 2000, animationType: "fade" },
  "portrait-library": { intervalDuration: 2000, animationType: "fade" },
  package: { intervalDuration: 2000, animationType: "zoom" },
  "landscape-library": { intervalDuration: 2000, animationType: "slide" },
};

async function requireAdmin(request: Request) {
  const token = getSessionTokenFromRequest(request);
  const session = await verifySessionToken(token);
  return session?.accessRole === "admin" || session?.accessRole === "staff";
}

function getFolderPath(folder: BentoFolder) {
  return path.join(process.cwd(), "public", folder);
}

function getOrderFilePath(folder: BentoFolder) {
  return path.join(getFolderPath(folder), "order.json");
}

function getSettingsFilePath() {
  return path.join(process.cwd(), "public", "bento-settings.json");
}

export function readBentoSettings(): BentoSettings {
  const filePath = getSettingsFilePath();
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(content);
      return { ...DEFAULT_SETTINGS, ...parsed };
    } catch (e) {
      console.error("Error reading bento-settings.json", e);
    }
  }
  return DEFAULT_SETTINGS;
}

function saveBentoSettings(settings: Partial<BentoSettings>) {
  const current = readBentoSettings();
  const updated = { ...current, ...settings };
  fs.writeFileSync(getSettingsFilePath(), JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

function readFolderImages(folder: BentoFolder): string[] {
  const dirPath = getFolderPath(folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return [];
  }

  const allFiles = fs.readdirSync(dirPath).filter((file) => {
    if (file === "order.json" || file.startsWith(".")) return false;
    const stat = fs.statSync(path.join(dirPath, file));
    return stat.isFile();
  });

  const orderFile = getOrderFilePath(folder);
  let orderedFilenames: string[] = [];

  if (fs.existsSync(orderFile)) {
    try {
      const content = fs.readFileSync(orderFile, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        orderedFilenames = parsed.filter((name) => typeof name === "string");
      }
    } catch (e) {
      console.error(`Error reading order.json for ${folder}:`, e);
    }
  }

  const existingOrdered = orderedFilenames.filter((name) =>
    allFiles.includes(name),
  );

  const remaining = allFiles.filter((name) => !existingOrdered.includes(name));
  const finalOrder = [...existingOrdered, ...remaining];

  return finalOrder.map((name) => `/${folder}/${name}`);
}

function saveFolderOrder(folder: BentoFolder, filenames: string[]) {
  const dirPath = getFolderPath(folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const orderFile = getOrderFilePath(folder);
  fs.writeFileSync(orderFile, JSON.stringify(filenames, null, 2), "utf-8");
}

// GET all bento folder images and settings
export async function GET() {
  try {
    const data: Record<string, string[]> = {};
    for (const folder of BENTO_FOLDERS) {
      data[folder] = readFolderImages(folder);
    }
    const settings = readBentoSettings();
    return NextResponse.json({ success: true, folders: data, settings });
  } catch (error) {
    console.error("Error fetching bento images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bento images" },
      { status: 500 },
    );
  }
}

// POST upload, update, or delete handler (handles all write actions to support environments where PUT/DELETE return 501)
export async function POST(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // Handle JSON body requests (Delete or Update/Save)
    if (contentType.includes("application/json")) {
      const body = await request.json();

      // Action: Delete Image
      if (body.action === "delete") {
        const { folder, imagePath } = body as {
          folder: BentoFolder;
          imagePath: string;
        };

        if (!folder || !BENTO_FOLDERS.includes(folder) || !imagePath) {
          return NextResponse.json(
            { success: false, error: "Invalid parameters for delete" },
            { status: 400 },
          );
        }

        const filename = path.basename(imagePath);
        const filePath = path.join(getFolderPath(folder), filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        const currentImages = readFolderImages(folder);
        const updatedFilenames = currentImages.map((img) => path.basename(img));
        saveFolderOrder(folder, updatedFilenames);

        return NextResponse.json({
          success: true,
          folder,
          images: readFolderImages(folder),
        });
      }

      // Action: Save Order / Settings
      if (body.action === "update" || body.action === "updateSettings" || body.settings || body.images) {
        const { folder, images, settings } = body as {
          folder?: BentoFolder;
          images?: string[];
          settings?: BentoSettings;
        };

        if (settings) {
          saveBentoSettings(settings);
        }

        if (folder && BENTO_FOLDERS.includes(folder) && Array.isArray(images)) {
          const filenames = images.map((img) => path.basename(img));
          saveFolderOrder(folder, filenames);
        }

        return NextResponse.json({
          success: true,
          folder,
          images: folder ? readFolderImages(folder) : undefined,
          settings: readBentoSettings(),
        });
      }
    }

    // Handle Multipart Form Data (Upload)
    const formData = await request.formData();
    const folder = formData.get("folder") as BentoFolder;

    if (!folder || !BENTO_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder target" },
        { status: 400 },
      );
    }

    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File;
    const uploadFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (uploadFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 },
      );
    }

    const dirPath = getFolderPath(folder);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const currentImages = readFolderImages(folder);
    const currentFilenames = currentImages.map((img) => path.basename(img));
    const newFilenames: string[] = [];

    for (const file of uploadFiles) {
      const originalName = file.name.replace(/[^a-zA-Z0-9.\-_ ()]/g, "_");
      let targetName = originalName;

      let counter = 1;
      const ext = path.extname(originalName);
      const nameWithoutExt = path.basename(originalName, ext);

      while (fs.existsSync(path.join(dirPath, targetName))) {
        targetName = `${nameWithoutExt}_${counter}${ext}`;
        counter++;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(path.join(dirPath, targetName), buffer);
      newFilenames.push(targetName);
    }

    const updatedFilenames = [...currentFilenames, ...newFilenames];
    saveFolderOrder(folder, updatedFilenames);

    return NextResponse.json({
      success: true,
      folder,
      images: readFolderImages(folder),
    });
  } catch (error) {
    console.error("Error in hero-grid POST route:", error);
    return NextResponse.json(
      { success: false, error: "Operation failed" },
      { status: 500 },
    );
  }
}

// PUT handler (for standard REST clients)
export async function PUT(request: Request) {
  return POST(request);
}

// DELETE handler (for standard REST clients)
export async function DELETE(request: Request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { folder, imagePath } = body as {
      folder: BentoFolder;
      imagePath: string;
    };

    if (!folder || !BENTO_FOLDERS.includes(folder) || !imagePath) {
      return NextResponse.json(
        { success: false, error: "Invalid parameters" },
        { status: 400 },
      );
    }

    const filename = path.basename(imagePath);
    const filePath = path.join(getFolderPath(folder), filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const currentImages = readFolderImages(folder);
    const updatedFilenames = currentImages.map((img) => path.basename(img));
    saveFolderOrder(folder, updatedFilenames);

    return NextResponse.json({
      success: true,
      folder,
      images: readFolderImages(folder),
    });
  } catch (error) {
    console.error("Error deleting hero grid image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 },
    );
  }
}
