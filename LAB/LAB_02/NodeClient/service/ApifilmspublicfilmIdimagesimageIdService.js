'use strict';

const path = require('path')
const fs = require('fs')
const apiFilmsPublicFilmIdService = require('./ApifilmspublicfilmIdService')
const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage');
const { getExtensionFromMimeType } = require('../utils/MediaTypeImages');
const MediaTypeImagesEnum = require('../utils/MediaTypeImages').MediaTypeImagesEnum

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

    console.log(imageMetadata)
    console.log(mimetypes)


    for (const ext of mimetypes) {
      const filePath = path.join(__dirname, '../uploads', imageMetadata.filename + ext);
      console.log(filePath)
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

      // TODO: da capire se bisogna controllare l'utente invitato o meno
      if (countReviews.count == 0) {
        const error = new Error(ErrorsPage.ERROR_AUTHORIZATION);
        error.status = 403;
        throw error;
      }
    }

    const sql = 'SELECT * FROM images WHERE id = ? and filmId = ?';
    const row = await dbUtils.dbGetAsync(sql, [imageId, filmId]);
    const metadataImage = dbUtils.mapObjToImage(row);

    if (!metadataImage) {
      const error = new Error(ErrorsPage.ERROR_IMAGE_NOT_FOUND_OR_INVALID);
      error.status = 404;
      throw error;
    }

    // It is requested the image metadata
    if (MediaTypeImagesEnum.JSON.mimeType == MediaTypeImagesEnum[imageType].mimeType) {
      return metadataImage;
    }
    // It is requested the image file
    else {
      const sql = 'SELECT COUNT(*) AS count FROM image_formats WHERE imageId = ? and mimetype = ?';
      const existMimetype = await dbUtils.dbGetAsync(sql, [imageId, MediaTypeImagesEnum[imageType].mimeType]);

      if (existMimetype.count == 0) {
        throw new Error("Non esiste, è da implementare!");
      } else {

        // If the image is .jpg or .jpeg, the image can be saved in either of these formats
        if (MediaTypeImagesEnum[imageType].mimeType === MediaTypeImagesEnum.JPG.mimeType ||
          MediaTypeImagesEnum[imageType].mimeType === MediaTypeImagesEnum.JPEG.mimeType) {
          const possibleExtensions = [MediaTypeImagesEnum.JPG.extension, MediaTypeImagesEnum.JPEG.extension];

          for (const ext of possibleExtensions) {
            const filePath = path.join(__dirname, '../uploads', metadataImage.filename + ext);
            if (fs.existsSync(filePath)) {
              return filePath;
            }
          }
        } else {
          const filename = metadataImage.filename + MediaTypeImagesEnum[imageType].extension;
          return path.join(__dirname, '../uploads', filename);
        }
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

