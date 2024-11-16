'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdimages = require('../service/ApifilmspublicfilmIdimagesService');

module.exports.addImage = function addImage (req, res, next, filmId) {
  ApifilmspublicfilmIdimages.addImage(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getImageListForPublicFilm = function getImageListForPublicFilm (req, res, next, filmId) {
  ApifilmspublicfilmIdimages.getImageListForPublicFilm(filmId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
