import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/cloudinary";

/**
 * Upload image to Cloudinary
 */
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert buffer to base64
    const base64 = buffer.toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "hs-architects/home-grid",
      resource_type: "image",
      transformation: [
        {
          width: 800,
          height: 800,
          crop: "fill",
          quality: "auto",
          format: "auto",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image", details: error.message },
      { status: 500 }
    );
  }
}
