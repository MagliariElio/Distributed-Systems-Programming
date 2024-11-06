'use strict';

var utils = require('../utils/writer.js');
var ApiusersuserId = require('../service/ApiusersuserIdService');

module.exports.getSingleUser = function getSingleUser (req, res, next, userId) {
  ApiusersuserId.getSingleUser(userId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
