'use strict';

var utils = require('../utils/writer.js');
var Apifilmsprivate = require('../service/ApifilmsprivateService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.getPrivateFilms = async function getPrivateFilms(req, res, next) {
  try {
    const pageNo = parseInt(req.query.pageNo) || 1;
    const loggedUserId = req.user.id;

    const response = await Apifilmsprivate.getPrivateFilms(loggedUserId, pageNo);

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
