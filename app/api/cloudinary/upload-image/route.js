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

    // Upload to Cloudinary - preserve original aspect ratio
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "hs-architects",
      resource_type: "image",
      // No forced cropping - keep original aspect ratio
      // Quality and format optimization only
      transformation: [
        {
          quality: "auto",
          format: "auto",
          // Limit max dimension but preserve aspect ratio
          width: 2000,
          height: 2000,
          crop: "limit",
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
