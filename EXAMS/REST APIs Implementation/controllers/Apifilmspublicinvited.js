'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublicinvited = require('../service/ApifilmspublicinvitedService');
const ErrorsPage = require('../utils/ErrorsPage');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.getInvitedFilms = async function getInvitedFilms(req, res, next) {
  try {
    if (req.query.pageNo && (isNaN(req.query.pageNo) || parseInt(req.query.pageNo) <= 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_PAGE_NO);
      error.status = 400;
      throw error;
    }

    const pageNo = parseInt(req.query.pageNo) || 1;
    const loggedUserId = req.user?.id;

    const response = await Apifilmspublicinvited.getInvitedFilms(loggedUserId, pageNo);

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
