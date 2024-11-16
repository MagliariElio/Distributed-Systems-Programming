'use strict';

var utils = require('../utils/writer.js');
var ApiusersuserId = require('../service/ApiusersuserIdService');
const ErrorResponse = require('../components/ErrorResponse')
const ErrorsPage = require('../utils/ErrorsPage')

module.exports.getSingleUser = async function getSingleUser(req, res, next) {
  try {
    const userId = req.params.userId;

    if (!userId || isNaN(userId)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_USER_ID);
      error.status = 400;
      throw error;
    }

    const response = await ApiusersuserId.getSingleUser(userId);

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
