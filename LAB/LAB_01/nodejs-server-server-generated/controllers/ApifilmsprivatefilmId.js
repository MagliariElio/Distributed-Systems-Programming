'use strict';

var utils = require('../utils/writer.js');
var ApifilmsprivatefilmId = require('../service/ApifilmsprivatefilmIdService');

module.exports.deleteSinglePrivateFilm = function deleteSinglePrivateFilm (req, res, next, filmId) {
  ApifilmsprivatefilmId.deleteSinglePrivateFilm(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSinglePrivateFilm = function getSinglePrivateFilm (req, res, next, filmId) {
  ApifilmsprivatefilmId.getSinglePrivateFilm(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateSinglePrivateFilm = function updateSinglePrivateFilm (req, res, next, body, filmId) {
  ApifilmsprivatefilmId.updateSinglePrivateFilm(body, filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
