'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublic = require('../service/ApifilmspublicService');

module.exports.getPublicFilms = function getPublicFilms (req, res, next, pageNo) {
  Apifilmspublic.getPublicFilms(pageNo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
