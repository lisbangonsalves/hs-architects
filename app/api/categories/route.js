import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dataFilePath = join(process.cwd(), "data", "categories.json");

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

export async function GET() {
  try {
    const categories = readData();
    return Response.json(categories);
  } catch (error) {
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const categories = readData();
    
    const newCategory = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    categories.push(newCategory);
    writeData(categories);
    
    return Response.json(newCategory, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const categories = readData();
    
    const index = categories.findIndex((cat) => cat.id === id);
    if (index === -1) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    
    categories[index] = { ...categories[index], ...updates };
    writeData(categories);
    
    return Response.json(categories[index]);
  } catch (error) {
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const categories = readData();
    const filtered = categories.filter((cat) => cat.id !== id);
    
    if (filtered.length === categories.length) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    
    writeData(filtered);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
