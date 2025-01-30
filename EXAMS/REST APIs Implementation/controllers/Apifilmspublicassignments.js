'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublicassignments = require('../service/ApifilmspublicassignmentsService');
const ErrorResponse = require('../components/ErrorResponse')

module.exports.assignReviewBalanced = async function assignReviewBalanced(req, res, next) {
  try {
    const loggedUserId = req.user?.id;

    const response = await Apifilmspublicassignments.assignReviewBalanced(loggedUserId);

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
