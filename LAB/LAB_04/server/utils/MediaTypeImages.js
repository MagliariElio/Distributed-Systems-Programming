
const path = require('path');

const MediaTypeImagesEnum = Object.freeze({
  JSON: {
    mimeType: 'application/json',
    extension: '.json'
  },
  PNG: {
    mimeType: 'image/png',
    extension: '.png'
  },
  JPG: {
    mimeType: 'image/jpg',
    extension: '.jpg'
  },
  JPEG: {
    mimeType: 'image/jpeg',
    extension: '.jpeg'
  },
  GIF: {
    mimeType: 'image/gif',
    extension: '.gif'
  }
});

/**
 * Checks if the provided MIME type is valid according to the MediaTypeImages enum.
 * 
 * @param {string} mimeType - The MIME type to validate.
 * @returns {boolean} - `true` if the MIME type is valid, `false` otherwise.
 */
function isValidImageType(mimeType) {
  return Object.values(MediaTypeImagesEnum)
    .some(type => type.mimeType.toLowerCase() === mimeType.toLowerCase());
}

/**
 * Converts a MIME type string to its corresponding enum key.
 * 
 * @param {string} mimeType - The MIME type to convert.
 * @returns {string|null} - The corresponding enum key (e.g., 'PNG', 'JPEG', etc.), or `null` if not found.
 */
function getEnumFromMimeType(mimeType) {
  const key = Object.keys(MediaTypeImagesEnum).find(
    (key) => MediaTypeImagesEnum[key].mimeType.toLowerCase() === mimeType.toLowerCase()
  );

  return key || null;
}

/**
 * Gets the file extension for a given MIME type.
 * 
 * This function takes a MIME type (e.g., 'image/png') and returns the associated file extension 
 * (e.g., '.png'). It uses the `MediaTypeImagesEnum` to find the corresponding extension.
 * 
 * @param {string} mimeType - The MIME type to convert.
 * @returns {string|null} - The file extension (e.g., '.png'), or `null` if the MIME type is invalid.
 */
function getExtensionFromMimeType(mimeType) {
  const key = Object.keys(MediaTypeImagesEnum).find(
    (key) => MediaTypeImagesEnum[key].mimeType.toLowerCase() === mimeType.toLowerCase()
  );

  return key ? MediaTypeImagesEnum[key].extension : null;
}

/**
 * Removes the file extension from a given file name.
 * 
 * This function takes a file name (which may include an extension) as input and returns the 
 * base name of the file without the extension. It utilizes Node.js's `path.basename()` method
 * to extract the file name, and `path.extname()` to determine and remove the extension.
 * 
 * @param {string} fileName - The full file name (including extension).
 * @returns {string} - The file name without its extension.
 */
function removeExtension(fileName) {
  return path.basename(fileName, path.extname(fileName));
}

/**
 * Gets the file extension from a given file name.
 * 
 * This function takes a file name (which may include an extension) as input and returns
 * the extension of the file (including the leading dot).
 * 
 * @param {string} fileName - The full file name (including extension).
 * @returns {string} - The file extension (including the leading dot).
 */
function getFileExtension(fileName) {
  return path.extname(fileName);
}

module.exports = { MediaTypeImagesEnum, isValidImageType, getEnumFromMimeType, removeExtension, getExtensionFromMimeType, getFileExtension };