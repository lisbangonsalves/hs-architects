import connectDB from "../../../lib/mongodb";
import Category from "../../../lib/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: 1 });
    
    // Convert to format expected by frontend (with id as string)
    const formattedCategories = categories.map((cat) => ({
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      gridImages: cat.gridImages || [],
      createdAt: cat.createdAt.toISOString(),
    }));
    
    return Response.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const newCategory = new Category({
      name: body.name,
      slug: body.slug,
      description: body.description,
      image: body.image || "",
      gridImages: body.gridImages || [],
    });
    
    await newCategory.save();
    
    return Response.json(
      {
        id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        image: newCategory.image,
        gridImages: newCategory.gridImages || [],
        createdAt: newCategory.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return Response.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updates } = body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { ...updates },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    
    return Response.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      gridImages: category.gridImages || [],
      createdAt: category.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return Response.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }
    
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return Response.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
