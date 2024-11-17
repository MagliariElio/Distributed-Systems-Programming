'use strict';

const apiFilmsPublicFilmIdService = require('./ApifilmspublicfilmIdService')
const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage');
const path = require('path');
const fs = require('fs');
const { MediaTypeImagesEnum, getFileExtension } = require('../utils/MediaTypeImages');
const removeExtension = require('../utils/MediaTypeImages').removeExtension

/**
 * Associate a new image to a public film
 * The image sent in request body is associated to the public film characterized by the ID specified in the path. Only the film owner can associate an image to the film.
 *
 * filmId Long ID of the film
 * loggedUserId Long ID of the logged user
 * returns Image
 **/
exports.addImage = async function (filmId, loggedUserId, imageFile) {
  try {
    await dbUtils.dbRunAsync('BEGIN TRANSACTION');
    
    const film = await apiFilmsPublicFilmIdService.getSinglePublicFilm(filmId);

    if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    }

    const originalname = removeExtension(imageFile.originalname);
    const filename = removeExtension(imageFile.filename);

    const sql = 'INSERT INTO images(filmId, originalname, filename) VALUES(?,?,?)';
    const id = await dbUtils.dbRunAsync(sql, [filmId, originalname, filename]);

    // If the image is .jpg then it is also .jpeg and viceversa
    if (imageFile.mimetype == MediaTypeImagesEnum.JPG.mimeType || imageFile.mimetype == MediaTypeImagesEnum.JPEG.mimeType) {
      imageFile.mimetype = MediaTypeImagesEnum.JPG.mimeType;

      if (getFileExtension(imageFile.filename) == MediaTypeImagesEnum.JPEG.extension) {
        const oldPathOriginFile = path.join(__dirname, '../uploads', imageFile.filename);
        const pathOriginFile = path.join(__dirname, '../uploads', filename + MediaTypeImagesEnum.JPG.extension);

        // Rename the file with .jpg extension 
        if (fs.existsSync(oldPathOriginFile)) {
          fs.renameSync(oldPathOriginFile, pathOriginFile);
        }
      }
    }

    const sqlImageFormat = 'INSERT INTO image_formats(imageId, mimetype) VALUES(?, ?)';
    await dbUtils.dbRunAsync(sqlImageFormat, [id, imageFile.mimetype]);

    const row = {
      id,
      originalname,
      filename,
      filmId
    }

    const imageMetadata = dbUtils.mapObjToImage(row);

    await dbUtils.dbRunAsync('COMMIT');

    return imageMetadata;
  } catch (err) {
    await dbUtils.dbRunAsync('ROLLBACK');

    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error inserting the image: ${err.message}`);
    }
  }
}

/**
 * Retrieve a list of images for a public film
 * This operation retrieves a list of image structures associated with the public film with ID `filmId`. The response contains metadata for each image, such as its ID, type, and other relevant details, but not the actual image content itself. This operation does not require authentication.
 *
 * filmId Long ID of the film to retrieve the images
 * loggedUserId Long ID of the logged user
 * returns Images
 **/
exports.getImageListForPublicFilm = async function (filmId, loggedUserId) {
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

    const sql = 'SELECT * FROM images WHERE filmId = ?';
    const images = await dbUtils.dbAllAsync(sql, [filmId]);

    images.forEach((row) => {
      row = dbUtils.mapObjToImage(row);
    });

    return images;
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching images: ${err.message}`);
    }
  }
}

