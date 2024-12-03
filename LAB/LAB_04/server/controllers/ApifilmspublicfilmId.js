'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmId = require('../service/ApifilmspublicfilmIdService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.deleteSinglePublicFilm = async function deleteSinglePublicFilm(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id;

    const response = await ApifilmspublicfilmId.deleteSinglePublicFilm(filmId, loggedUserId);

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

module.exports.getSinglePublicFilm = async function getSinglePublicFilm(req, res, next) {
  try {
    const filmId = req.params.filmId;

    const response = await ApifilmspublicfilmId.getSinglePublicFilm(filmId);

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

module.exports.updateSinglePublicFilm = async function updateSinglePublicFilm(req, res, next) {
  try {
    const body = req.body;
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id;

    const response = await ApifilmspublicfilmId.updateSinglePublicFilm(body, filmId, loggedUserId);

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
