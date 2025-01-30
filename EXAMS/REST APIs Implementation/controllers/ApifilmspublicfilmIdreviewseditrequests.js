'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviewseditrequests = require('../service/ApifilmspublicfilmIdreviewseditrequestsService');
const ErrorResponse = require('../components/ErrorResponse.js');

module.exports.cancelReviewRequest = async function cancelReviewRequest(req, res, next) {
  try {
    const filmId = parseInt(req.params.filmId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviewseditrequests.cancelReviewRequest(filmId, loggedUserId);

    utils.writeJson(res, response, 204);
  } catch (err) {
    const status = err.status;
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};

module.exports.createReviewModificationRequest = async function createReviewModificationRequest(req, res, next) {
  try {
    const deadline = req.body.deadline;
    const filmId = parseInt(req.params.filmId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviewseditrequests.createReviewModificationRequest(deadline, filmId, loggedUserId);

    utils.writeJson(res, response, 201);
  } catch (err) {
    const status = err.status;
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};