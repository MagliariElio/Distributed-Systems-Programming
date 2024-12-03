'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdimagesimageId = require('../service/ApifilmspublicfilmIdimagesimageIdService');
const ErrorResponse = require('../components/ErrorResponse')
const ErrorsPage = require('../utils/ErrorsPage')
const getEnumFromMimeType = require('../utils/MediaTypeImages').getEnumFromMimeType
const MediaTypeImagesEnum = require('../utils/MediaTypeImages').MediaTypeImagesEnum

module.exports.deleteSingleImage = async function deleteSingleImage(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const imageId = req.params.imageId;
    const loggedUserId = req.user.id;

    const response = await ApifilmspublicfilmIdimagesimageId.deleteSingleImage(filmId, imageId, loggedUserId);

    utils.writeJson(res, response, 204);
  } catch (err) {
    const status = err.status
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};

module.exports.getSingleImage = async function getSingleImage(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const imageId = req.params.imageId;
    const loggedUserId = req.user.id;

    var imageType = getEnumFromMimeType(req.headers.accept);
    if (imageType == null) {
      const errorResponse = new ErrorResponse(415, ErrorsPage.ERROR_IMAGE_FILE_TYPE);
      utils.writeJson(res, errorResponse, errorResponse.code);
      return;
    }

    // JPEG format is also JPG
    if (MediaTypeImagesEnum[imageType] == MediaTypeImagesEnum.JPEG) {
      imageType = getEnumFromMimeType(MediaTypeImagesEnum.JPG.mimeType);
    }

    const response = await ApifilmspublicfilmIdimagesimageId.getSingleImage(filmId, imageId, loggedUserId, imageType);

    // It is requested the image metadata
    if (MediaTypeImagesEnum.JSON.mimeType == MediaTypeImagesEnum[imageType].mimeType) {
      utils.writeJson(res, response, 200);
      return;
    }
    // It is requested the image file
    else {
      return res.sendFile(response, (err) => {
        if (err) {
          const errorResponse = new ErrorResponse(500, ErrorsPage.ERROR_IMAGE_SEND_FAILURE);
          res.status(errorResponse.code).send(errorResponse);
        }
      });
    }
  } catch (err) {
    const status = err.status
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};
