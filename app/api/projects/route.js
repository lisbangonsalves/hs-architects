import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dataFilePath = join(process.cwd(), "data", "projects.json");

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    
    let projects = readData();
    
    if (categoryId) {
      projects = projects.filter((p) => p.categoryId === categoryId);
    }
    
    return Response.json(projects);
  } catch (error) {
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const projects = readData();
    
    const newProject = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    projects.push(newProject);
    writeData(projects);
    
    return Response.json(newProject, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const projects = readData();
    
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }
    
    projects[index] = { ...projects[index], ...updates };
    writeData(projects);
    
    return Response.json(projects[index]);
  } catch (error) {
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const projects = readData();
    const filtered = projects.filter((p) => p.id !== id);
    
    if (filtered.length === projects.length) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }
    
    writeData(filtered);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
