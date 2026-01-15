import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dataFilePath = join(process.cwd(), "data", "homeGrid.json");

function readData() {
  try {
    const fileContents = readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

function writeData(data) {
  writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

// GET - Fetch all home grid images
export async function GET() {
  try {
    const data = readData();
    // Sort by position
    const sorted = data.sort((a, b) => a.position - b.position);
    return Response.json(sorted);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch home grid images" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific grid image
export async function PUT(request) {
  try {
    const { id, image, cloudinaryPublicId } = await request.json();

    if (!id) {
      return Response.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const data = readData();
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      return Response.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Update the image
    data[index] = {
      ...data[index],
      image: image || data[index].image,
      cloudinaryPublicId: cloudinaryPublicId !== undefined ? cloudinaryPublicId : data[index].cloudinaryPublicId,
      updatedAt: new Date().toISOString(),
    };

    writeData(data);
    return Response.json(data[index]);
  } catch (error) {
    return Response.json(
      { error: "Failed to update home grid image" },
      { status: 500 }
    );
  }
}

// POST - Reorder grid images
export async function POST(request) {
  try {
    const { images } = await request.json();

    if (!Array.isArray(images) || images.length !== 9) {
      return Response.json(
        { error: "Exactly 9 images are required" },
        { status: 400 }
      );
    }

    const updated = images.map((img, index) => ({
      ...img,
      position: index + 1,
      updatedAt: new Date().toISOString(),
    }));

    writeData(updated);
    return Response.json(updated);
  } catch (error) {
    return Response.json(
      { error: "Failed to reorder home grid images" },
      { status: 500 }
    );
  }
}
