'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublicinvited = require('../service/ApifilmspublicinvitedService');

module.exports.getInvitedFilms = function getInvitedFilms (req, res, next, pageNo) {
  Apifilmspublicinvited.getInvitedFilms(pageNo)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
