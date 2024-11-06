'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviewsreviewerId = require('../service/ApifilmspublicfilmIdreviewsreviewerIdService');

module.exports.deleteSingleReview = function deleteSingleReview (req, res, next, filmId, reviewerId) {
  ApifilmspublicfilmIdreviewsreviewerId.deleteSingleReview(filmId, reviewerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSingleReview = function getSingleReview (req, res, next, filmId, reviewerId) {
  ApifilmspublicfilmIdreviewsreviewerId.getSingleReview(filmId, reviewerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSingleReview = function updateSingleReview (req, res, next, body, filmId, reviewerId) {
  ApifilmspublicfilmIdreviewsreviewerId.updateSingleReview(body, filmId, reviewerId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
