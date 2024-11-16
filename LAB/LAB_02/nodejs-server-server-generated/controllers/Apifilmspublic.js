'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublic = require('../service/ApifilmspublicService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.getPublicFilms = async function getPublicFilms(req, res, next) {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;

    const response = await Apifilmspublic.getPublicFilms(pageNo);

    utils.writeJson(res, response, 200);
  } catch (err) {
    const status = err.status
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};
