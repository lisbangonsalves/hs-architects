import connectDB from "../../../lib/mongodb";
import Project from "../../../lib/models/Project";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    
    let query = {};
    if (categoryId) {
      query.categoryId = categoryId;
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    
    // Convert to format expected by frontend (with id as string)
    const formattedProjects = projects.map((project) => ({
      id: project._id.toString(),
      name: project.name,
      categoryId: project.categoryId,
      label: project.label,
      location: project.location,
      year: project.year,
      image: project.image,
      href: project.href,
      title: project.title,
      description: project.description,
      images: project.images,
      createdAt: project.createdAt.toISOString(),
    }));
    
    return Response.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newProject = new Project({
      name: body.name,
      categoryId: body.categoryId,
      label: body.label,
      location: body.location || "",
      year: body.year || "",
      image: body.image || "",
      href: body.href || "",
      title: body.title || "",
      description: body.description || "",
      images: body.images || [],
    });
    
    await newProject.save();
    
    return Response.json(
      {
        id: newProject._id.toString(),
        name: newProject.name,
        categoryId: newProject.categoryId,
        label: newProject.label,
        location: newProject.location,
        year: newProject.year,
        image: newProject.image,
        href: newProject.href,
        title: newProject.title,
        description: newProject.description,
        images: newProject.images,
        createdAt: newProject.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updates } = body;
    
    const project = await Project.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }
    
    return Response.json({
      id: project._id.toString(),
      name: project.name,
      categoryId: project.categoryId,
      label: project.label,
      location: project.location,
      year: project.year,
      image: project.image,
      href: project.href,
      title: project.title,
      description: project.description,
      images: project.images,
      createdAt: project.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
