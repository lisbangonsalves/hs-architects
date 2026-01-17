import connectDB from "../../../lib/mongodb";
import HomeGrid from "../../../lib/models/HomeGrid";

// GET - Fetch all home grid images
export async function GET() {
  try {
    await connectDB();
    const data = await HomeGrid.find({}).sort({ position: 1 });
    
    // Convert to format expected by frontend
    const formattedData = data.map((item) => ({
      id: item._id.toString(),
      position: item.position,
      image: item.image,
      cloudinaryPublicId: item.cloudinaryPublicId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
    
    return Response.json(formattedData);
  } catch (error) {
    console.error("Error fetching home grid images:", error);
    return Response.json(
      { error: "Failed to fetch home grid images" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific grid image (or create if doesn't exist)
export async function PUT(request) {
  try {
    await connectDB();
    const { id, position, image, cloudinaryPublicId } = await request.json();

    if (!id && !position) {
      return Response.json(
        { error: "Image ID or position is required" },
        { status: 400 }
      );
    }

    let item;
    
    // If ID starts with "temp-", it's a new entry - create it
    if (id && id.startsWith("temp-")) {
      // Create new entry at the specified position
      const pos = position || parseInt(id.split("-")[1]) + 1;
      item = await HomeGrid.create({
        position: pos,
        image: image || "",
        cloudinaryPublicId: cloudinaryPublicId || null,
      });
    } else if (id && !id.startsWith("temp-")) {
      // Update existing entry
      const updateData = {};
      if (image !== undefined) updateData.image = image;
      if (cloudinaryPublicId !== undefined) updateData.cloudinaryPublicId = cloudinaryPublicId;
      if (position !== undefined) updateData.position = position;

      item = await HomeGrid.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!item) {
        return Response.json(
          { error: "Image not found" },
          { status: 404 }
        );
      }
    } else {
      // Create by position only
      const pos = position || 1;
      item = await HomeGrid.create({
        position: pos,
        image: image || "",
        cloudinaryPublicId: cloudinaryPublicId || null,
      });
    }

    return Response.json({
      id: item._id.toString(),
      position: item.position,
      image: item.image,
      cloudinaryPublicId: item.cloudinaryPublicId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating home grid image:", error);
    return Response.json(
      { error: "Failed to update home grid image" },
      { status: 500 }
    );
  }
}

// POST - Reorder grid images
export async function POST(request) {
  try {
    await connectDB();
    const { images } = await request.json();

    if (!Array.isArray(images) || images.length !== 9) {
      return Response.json(
        { error: "Exactly 9 images are required" },
        { status: 400 }
      );
    }

    // Update all images in a transaction-like operation
    const updatePromises = images.map((img, index) => {
      return HomeGrid.findByIdAndUpdate(
        img.id,
        {
          position: index + 1,
          image: img.image,
          cloudinaryPublicId: img.cloudinaryPublicId,
        },
        { new: true, runValidators: true }
      );
    });

    const updated = await Promise.all(updatePromises);

    const formattedData = updated.map((item) => ({
      id: item._id.toString(),
      position: item.position,
      image: item.image,
      cloudinaryPublicId: item.cloudinaryPublicId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));

    return Response.json(formattedData);
  } catch (error) {
    console.error("Error reordering home grid images:", error);
    return Response.json(
      { error: "Failed to reorder home grid images" },
      { status: 500 }
    );
  }
}
