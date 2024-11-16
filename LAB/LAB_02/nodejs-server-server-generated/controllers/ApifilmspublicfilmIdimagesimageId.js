'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdimagesimageId = require('../service/ApifilmspublicfilmIdimagesimageIdService');

module.exports.deleteSingleImage = function deleteSingleImage (req, res, next, filmId, imageId) {
  ApifilmspublicfilmIdimagesimageId.deleteSingleImage(filmId, imageId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSingleImage = function getSingleImage (req, res, next, filmId, imageId) {
  ApifilmspublicfilmIdimagesimageId.getSingleImage(filmId, imageId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
