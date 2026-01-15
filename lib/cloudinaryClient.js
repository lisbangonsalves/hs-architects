/**
 * Client-side Cloudinary utility functions
 * These work in the browser and use the public cloud name
 * 
 * Required environment variable in .env.local:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (required - must be prefixed with NEXT_PUBLIC_ to be accessible client-side)
 * 
 * Note: API key and secret are NOT accessible client-side for security reasons.
 * Use the server-side lib/cloudinary.js for operations requiring API credentials.
 */

/**
 * Generate a Cloudinary image URL with transformations
 * @param {string} publicId - The public ID of the image in Cloudinary (e.g., "architecture/project1")
 * @param {object} options - Transformation options
 * @returns {string} - The Cloudinary URL
 */
export function getCloudinaryImageUrl(publicId, options = {}) {
  // Client-side can only access NEXT_PUBLIC_ prefixed environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables. Please add it to your .env.local file.');
    // Return the publicId as-is if it's already a full URL, otherwise return as fallback
    return publicId.startsWith('http') ? publicId : publicId;
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    ...otherOptions
  } = options;

  // Build transformation string
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Add any other transformations
  Object.entries(otherOptions).forEach(([key, value]) => {
    if (value !== undefined) {
      transformations.push(`${key}_${value}`);
    }
  });

  const transformationString = transformations.join(',');
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  
  if (transformationString) {
    return `${baseUrl}/${transformationString}/${publicId}`;
  }
  
  return `${baseUrl}/${publicId}`;
}

/**
 * Helper to get Cloudinary URL for Next.js Image component
 * Automatically handles responsive sizes
 */
export function getCloudinarySrc(publicId, width, height) {
  return getCloudinaryImageUrl(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  });
}
