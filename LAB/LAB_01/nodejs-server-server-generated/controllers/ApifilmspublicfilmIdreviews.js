'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviews = require('../service/ApifilmspublicfilmIdreviewsService');

module.exports.getFilmReviews = function getFilmReviews (req, res, next, filmId, pageNo) {
  ApifilmspublicfilmIdreviews.getFilmReviews(filmId, pageNo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.issueFilmReview = function issueFilmReview (req, res, next, body, filmId) {
  ApifilmspublicfilmIdreviews.issueFilmReview(body, filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
