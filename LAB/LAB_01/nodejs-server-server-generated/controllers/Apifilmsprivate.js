'use strict';

var utils = require('../utils/writer.js');
var Apifilmsprivate = require('../service/ApifilmsprivateService');

module.exports.getPrivateFilms = function getPrivateFilms (req, res, next, pageNo) {
  Apifilmsprivate.getPrivateFilms(pageNo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
