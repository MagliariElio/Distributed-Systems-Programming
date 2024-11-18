'use strict';

const path = require('path');
const fs = require('fs');
const apiFilmsPublicFilmIdService = require('./ApifilmspublicfilmIdService');
const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');
const { getExtensionFromMimeType } = require('../utils/MediaTypeImages');
const { convertImage } = require('./ConverterService');
const MediaTypeImagesEnum = require('../utils/MediaTypeImages').MediaTypeImagesEnum;

/**
 * Delete an image associated to a public film
 * The image to be deleted is the one with ID `imageId`, associated to the film with ID `filmId`. Only the film owner can delete the image. 
 *
 * filmId Long ID of the film
 * imageId Long ID of the image
 * loggedUserId Long ID of the logged user
 * no response value expected for this operation
 **/
exports.deleteSingleImage = async function (filmId, imageId, loggedUserId) {
  try {
    const film = await apiFilmsPublicFilmIdService.getSinglePublicFilm(filmId);

    if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    }

    const sqlMetedata = 'SELECT * FROM images WHERE id = ?';
    const row = await dbUtils.dbGetAsync(sqlMetedata, [imageId]);
    const imageMetadata = dbUtils.mapObjToImage(row);

    if (!imageMetadata) {
      const error = new Error(ErrorsPage.ERROR_IMAGE_NOT_FOUND_OR_INVALID);
      error.status = 404;
      throw error;
    }

    const sqlExtensions = 'SELECT mimetype FROM image_formats WHERE imageId = ?';
    const rows = await dbUtils.dbAllAsync(sqlExtensions, [imageId]);
    const mimetypes = rows.map((type) => getExtensionFromMimeType(type.mimetype));

    for (const ext of mimetypes) {
      const filePath = path.join(__dirname, '../uploads', imageMetadata.filename + ext);
      if (fs.existsSync(filePath)) {
        try {
          // Delete the image
          fs.unlinkSync(filePath);
        } catch (err) {
          throw new Error(`Error deleting image locally: ${filePath}`);
        }
      }
    }

    const sqlDelete = 'DELETE FROM images WHERE id = ?';
    await dbUtils.dbRunAsync(sqlDelete, [imageId]);

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error deleting the image: ${err.message}`);
    }
  }
}

/**
 * Retrieve an image associated to a public film
 * The image with ID `imageId`, associated to the film with ID `filmId`, is retrieved. In particular, by specifying the desired content type via the Accept header, the user can decide whether to retrieve the image data structure (json content type), which does not contain the image file, or the image file itself, in one of the supported image content types (image/png, image/jpg, and image/gif). Only the film owner or a film reviewer can perform this operation.
 *
 * filmId Long ID of the film
 * imageId Long ID of the image
 * loggedUserId Long ID of the logged user
 * imageType Media type of the image (enum)
 * returns Image
 **/
exports.getSingleImage = async function (filmId, imageId, loggedUserId, imageType) {
  try {
    const film = await apiFilmsPublicFilmIdService.getSinglePublicFilm(filmId);

    if (film.owner != loggedUserId) {
      const sqlCountReviews = 'SELECT COUNT(*) AS count FROM reviews WHERE filmId = ? and reviewerId = ?';
      const countReviews = await dbUtils.dbGetAsync(sqlCountReviews, [filmId, loggedUserId]);

      if (countReviews.count == 0) {
        const error = new Error(ErrorsPage.ERROR_AUTHORIZATION);
        error.status = 403;
        throw error;
      }
    }

    // Check if the requested image exists in the film's image database
    const sql = 'SELECT * FROM images WHERE id = ? and filmId = ?';
    const row = await dbUtils.dbGetAsync(sql, [imageId, filmId]);
    const metadataImage = dbUtils.mapObjToImage(row);

    // If the image metadata does not exist, throw an error
    if (!metadataImage) {
      const error = new Error(ErrorsPage.ERROR_IMAGE_NOT_FOUND_OR_INVALID);
      error.status = 404;
      throw error;
    }

    // If the client requested image metadata (JSON), return the metadata
    if (MediaTypeImagesEnum.JSON.mimeType == MediaTypeImagesEnum[imageType].mimeType) {
      return metadataImage;
    }
    // If the client requested the image file itself, proceed to convert or fetch the image
    else {
      // Check if the image format exists for the requested mimeType
      const sql = 'SELECT COUNT(*) AS count FROM image_formats WHERE imageId = ? AND mimetype = ?';
      const existMimetype = await dbUtils.dbGetAsync(sql, [imageId, MediaTypeImagesEnum[imageType].mimeType]);

      if (existMimetype.count == 0) {
        // If the required mimeType is not found, try to find a compatible image format
        const possibleExtensions = Object.values(MediaTypeImagesEnum).filter((type) => type != MediaTypeImagesEnum.JSON);

        var pathOriginFile = null;
        var fileTypeOrigin = null;
        var fileTypeTarget = null;

        // Try to find a matching file extension from the existing formats
        for (let ext of possibleExtensions) {
          pathOriginFile = path.join(__dirname, '../uploads', metadataImage.filename + ext.extension);

          if (fs.existsSync(pathOriginFile)) {
            fileTypeOrigin = ext.mimeType.replace('image/', '');
            fileTypeTarget = MediaTypeImagesEnum[imageType].mimeType.replace('image/', '');
            break;
          }
        }

        // If no valid file is found, throw an error indicating extension resolution failure
        if (pathOriginFile == null || fileTypeOrigin == null || fileTypeTarget == null) {
          throw new Error(ErrorsPage.ERROR_FILE_EXTENSION_RESOLUTION);
        }

        // Define the target file path where the converted file will be saved
        const pathTargetFile = path.join(__dirname, '../uploads', metadataImage.filename + MediaTypeImagesEnum[imageType].extension);

        // Perform the conversion and save the file
        await convertImage(pathOriginFile, pathTargetFile, fileTypeOrigin, fileTypeTarget);

        // Update the image formats table with the new mimeType after conversion
        const sql = 'INSERT INTO image_formats(imageId, mimetype) VALUES(?, ?)';
        await dbUtils.dbRunAsync(sql, [imageId, MediaTypeImagesEnum[imageType].mimeType]);
        return pathTargetFile;
      } else {
        // Return the path with the appropriate extension
        const filename = metadataImage.filename + MediaTypeImagesEnum[imageType].extension;
        return path.join(__dirname, '../uploads', filename);
      }
    }
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching the image: ${err.message}`);
    }
  }
}

