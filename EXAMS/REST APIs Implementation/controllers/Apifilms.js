'use strict';

var utils = require('../utils/writer.js');
var Apifilms = require('../service/ApifilmsService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.createFilm = async function createFilm(req, res, next) {
  try {
    const film = req.body;
    const ownerId = req.user.id;

    const response = await Apifilms.createFilm(film, ownerId);

    utils.writeJson(res, response, 201);
  } catch (err) {
    const errorResponse = new ErrorResponse(500, err.message)
    utils.writeJson(res, errorResponse);
  }
};
