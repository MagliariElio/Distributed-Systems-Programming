'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdimages = require('../service/ApifilmspublicfilmIdimagesService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.addImage = async function addImage(req, res, next) {
  try {
    const loggedUserId = req.user.id;
    const filmId = req.params.filmId;
    const imageFile = req.file;

    const response = await ApifilmspublicfilmIdimages.addImage(filmId, loggedUserId, imageFile);

    utils.writeJson(res, response, 201);
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

module.exports.getImageListForPublicFilm = async function getImageListForPublicFilm(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id;

    const response = await ApifilmspublicfilmIdimages.getImageListForPublicFilm(filmId, loggedUserId);

    utils.writeJson(res, response, 200);
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

module.exports.addImage = async function addImage(req, res, next) {
  try {
    const loggedUserId = req.user.id;
    const filmId = req.params.filmId;
    const imageFile = req.file;

    const response = await ApifilmspublicfilmIdimages.addImage(filmId, loggedUserId, imageFile);

    utils.writeJson(res, response, 201);
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

module.exports.deleteAllImagesAboutFilm = async function deleteAllImagesAboutFilm(req, res, next) {
  try {
    const loggedUserId = req.user.id;
    const filmId = req.params.filmId;

    const response = await ApifilmspublicfilmIdimages.deleteAllImagesAboutFilm(filmId, loggedUserId);

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
