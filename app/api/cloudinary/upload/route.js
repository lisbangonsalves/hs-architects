import { NextResponse } from 'next/server';
import cloudinary from '../../../../lib/cloudinary';

/**
 * Example API route for Cloudinary uploads (server-side only)
 * This uses the API key and secret from environment variables
 */
export async function POST(request) {
  try {
    const { image, publicId, folder } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary using server-side credentials
    const result = await cloudinary.uploader.upload(image, {
      public_id: publicId,
      folder: folder || 'hs-architects',
      resource_type: 'image',
    });

    return NextResponse.json({
      success: true,
      publicId: result.public_id,
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Example: Get signed upload URL
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');
    const folder = searchParams.get('folder') || 'hs-architects';

    if (!publicId) {
      return NextResponse.json(
        { error: 'publicId is required' },
        { status: 400 }
      );
    }

    // Generate a signed upload URL (requires API secret)
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: `${folder}/${publicId}`,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  } catch (error) {
    console.error('Cloudinary signature error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature', details: error.message },
      { status: 500 }
    );
  }
}
