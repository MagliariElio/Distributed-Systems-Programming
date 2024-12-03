'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdselection = require('../service/ApifilmspublicfilmIdselectionService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.patchFilmActiveSelection = async function patchFilmActiveSelection(req, res, next) {
  try {
    const filmId = req.params.filmId;
    const loggedUserId = req.user.id;

    const response = await ApifilmspublicfilmIdselection.patchFilmActiveSelection(filmId, loggedUserId);

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