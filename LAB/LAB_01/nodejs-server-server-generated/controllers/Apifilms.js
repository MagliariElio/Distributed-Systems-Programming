'use strict';

var utils = require('../utils/writer.js');
var Apifilms = require('../service/ApifilmsService');

module.exports.createFilm = function createFilm (req, res, next, body) {
  Apifilms.createFilm(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
