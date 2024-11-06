'use strict';

var utils = require('../utils/writer.js');
var Apiusersauthenticator = require('../service/ApiusersauthenticatorService');

module.exports.authenticateUser = function authenticateUser (req, res, next, body) {
  Apiusersauthenticator.authenticateUser(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
