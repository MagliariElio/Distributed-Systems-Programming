'use strict';

var utils = require('../utils/writer.js');
var ApifilmsprivatefilmId = require('../service/ApifilmsprivatefilmIdService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.deleteSinglePrivateFilm = async function deleteSinglePrivateFilm(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id;

    const response = await ApifilmsprivatefilmId.deleteSinglePrivateFilm(filmId, loggedUserId);

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

module.exports.getSinglePrivateFilm = async function getSinglePrivateFilm(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id

    const response = await ApifilmsprivatefilmId.getSinglePrivateFilm(filmId, loggedUserId);

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

module.exports.updateSinglePrivateFilm = async function updateSinglePrivateFilm(req, res, next) {
  try {
    const body = req.body;
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id

    const response = await ApifilmsprivatefilmId.updateSinglePrivateFilm(body, filmId, loggedUserId);

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
