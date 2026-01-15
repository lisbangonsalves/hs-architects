import { v2 as cloudinary } from 'cloudinary';

/**
 * Server-side Cloudinary configuration
 * 
 * Required environment variables in .env.local:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (required - used by both client and server)
 * - CLOUDINARY_API_KEY (required - server-side only, for uploads and admin operations)
 * - CLOUDINARY_API_SECRET (required - server-side only, for uploads and admin operations)
 * 
 * Optional:
 * - CLOUDINARY_CLOUD_NAME (optional - if not set, falls back to NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
 */
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Cloudinary configuration is incomplete. Please set CLOUDINARY_CLOUD_NAME (or NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME), CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

/**
 * Generate a Cloudinary image URL with transformations
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {object} options - Transformation options
 * @returns {string} - The Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    ...otherOptions
  } = options;

  const transformations = {
    width,
    height,
    crop,
    quality,
    format,
    ...otherOptions,
  };

  // Remove undefined values
  Object.keys(transformations).forEach(
    (key) => transformations[key] === undefined && delete transformations[key]
  );

  return cloudinary.url(publicId, {
    ...transformations,
    secure: true,
  });
}

/**
 * Generate a Cloudinary image URL for Next.js Image component
 * @param {string} publicId - The public ID of the image in Cloudinary
 * @param {object} options - Transformation options
 * @returns {string} - The Cloudinary URL
 */
export function getCloudinaryImageUrl(publicId, options = {}) {
  return getCloudinaryUrl(publicId, {
    quality: 'auto',
    format: 'auto',
    ...options,
  });
}

export default cloudinary;
