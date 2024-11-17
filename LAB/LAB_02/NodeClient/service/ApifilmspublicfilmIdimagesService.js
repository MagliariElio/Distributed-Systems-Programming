'use strict';

const apiFilmsPublicFilmIdService = require('./ApifilmspublicfilmIdService')
const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage');
const { MediaTypeImagesEnum } = require('../utils/MediaTypeImages');
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
      const sqlImageFormatJpg = 'INSERT INTO image_formats(imageId, mimetype) VALUES(?, ?)';
      await dbUtils.dbRunAsync(sqlImageFormatJpg, [id, MediaTypeImagesEnum.JPG.mimeType]);
      const sqlImageFormatJpeg = 'INSERT INTO image_formats(imageId, mimetype) VALUES(?, ?)';
      await dbUtils.dbRunAsync(sqlImageFormatJpeg, [id, MediaTypeImagesEnum.JPEG.mimeType]);
    } else {
      const sqlImageFormat = 'INSERT INTO image_formats(imageId, mimetype) VALUES(?, ?)';
      await dbUtils.dbRunAsync(sqlImageFormat, [id, imageFile.mimetype]);
    }

    const row = {
      id,
      originalname,
      filename,
      filmId
    }

    const imageMetadata = dbUtils.mapObjToImage(row);
    return imageMetadata;
  } catch (err) {
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

