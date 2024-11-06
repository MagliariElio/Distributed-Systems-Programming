'use strict';

var utils = require('../utils/writer.js');
var Apiusers = require('../service/ApiusersService');

module.exports.getUsers = function getUsers (req, res, next) {
  Apiusers.getUsers()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
