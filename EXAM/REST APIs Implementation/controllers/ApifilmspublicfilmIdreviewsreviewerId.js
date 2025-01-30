'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviewsreviewerId = require('../service/ApifilmspublicfilmIdreviewsreviewerIdService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.deleteSingleReview = async function deleteSingleReview(req, res, next) {
  try {
    const filmId = parseInt(req.params.filmId);
    const reviewerId = parseInt(req.params.reviewerId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviewsreviewerId.deleteSingleReview(filmId, reviewerId, loggedUserId);

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

module.exports.getSingleReview = async function getSingleReview(req, res, next) {
  try {
    const filmId = parseInt(req.params.filmId);
    const reviewerId = parseInt(req.params.reviewerId);
    const loggedUserId = req?.user?.id;

    const response = await ApifilmspublicfilmIdreviewsreviewerId.getSingleReview(filmId, reviewerId, loggedUserId);

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