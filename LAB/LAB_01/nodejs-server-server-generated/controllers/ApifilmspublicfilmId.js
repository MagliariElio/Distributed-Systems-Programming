'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmId = require('../service/ApifilmspublicfilmIdService');

module.exports.deleteSinglePublicFilm = function deleteSinglePublicFilm (req, res, next, filmId) {
  ApifilmspublicfilmId.deleteSinglePublicFilm(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSinglePublicFilm = function getSinglePublicFilm (req, res, next, filmId) {
  ApifilmspublicfilmId.getSinglePublicFilm(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSinglePublicFilm = function updateSinglePublicFilm (req, res, next, body, filmId) {
  ApifilmspublicfilmId.updateSinglePublicFilm(body, filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
