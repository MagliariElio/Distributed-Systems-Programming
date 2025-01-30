'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviews = require('../service/ApifilmspublicfilmIdreviewsService');
const ErrorsPage = require('../utils/ErrorsPage');
const ErrorResponse = require('../components/ErrorResponse');

module.exports.getFilmReviews = async function getFilmReviews(req, res, next) {
  try {
    if (req.query.pageNo && (isNaN(req.query.pageNo) || parseInt(req.query.pageNo) <= 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_PAGE_NO);
      error.status = 400;
      throw error;
    }

    const pageNo = parseInt(req.query.pageNo) || 1;
    const filmId = parseInt(req.params.filmId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviews.getFilmReviews(filmId, pageNo, loggedUserId);

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

module.exports.issueFilmReview = async function issueFilmReview(req, res, next) {
  try {
    const list = req.body;
    const filmId = parseInt(req.params.filmId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviews.issueFilmReview(list, filmId, loggedUserId);

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

module.exports.updateSingleReview = async function updateSingleReview(req, res, next) {
  try {
    const body = req.body;
    const filmId = parseInt(req.params.filmId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviews.updateSingleReview(body, filmId, loggedUserId);

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