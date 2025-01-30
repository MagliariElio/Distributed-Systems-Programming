'use strict';

var utils = require('../utils/writer.js');
var ApifilmspublicfilmIdreviewsreviewerIdeditrequests = require('../service/ApifilmspublicfilmIdreviewsreviewerIdeditrequestsService');
const dbUtils = require('../utils/DbUtils');
const ErrorResponse = require('../components/ErrorResponse.js');

module.exports.getReviewModificationRequest = async function getReviewModificationRequest(req, res, next) {
  try {
    const filmId = parseInt(req.params.filmId);
    const reviewerId = parseInt(req.params.reviewerId);
    const loggedUserId = req.user?.id;

    const response = await ApifilmspublicfilmIdreviewsreviewerIdeditrequests.getReviewModificationRequest(filmId, reviewerId, loggedUserId);

    utils.writeJson(res, response, 200);
  } catch (err) {
    const status = err.status;
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};

module.exports.updateReviewRequestStatus = async function updateReviewRequestStatus(req, res, next) {
  try {
    let status = req.body.status;
    const filmId = parseInt(req.params.filmId);
    const reviewerId = parseInt(req.params.reviewerId);
    const loggedUserId = req.user?.id;
    let error = undefined;

    // Convert the status
    switch (status.toLowerCase()) {
      case dbUtils.EditRequestStatus.PENDING:
        // Handle the case where status is 0 (Pending)
        error = new Error("The status must be one of 'accepted', or 'rejected'. Other values are not accepted.");
        error.status = 400;
        throw error;
      case dbUtils.EditRequestStatus.REJECTED:
        // Handle the case where status is 1 (Rejected)
        status = 1;
        break;
      case dbUtils.EditRequestStatus.ACCEPTED:
        // Handle the case where status is 2 (Accepted)
        status = 2;
        break;
      default:
        // Handle unknown status
        error = new Error("The status must be one of 'accepted', or 'rejected'. Other values are not accepted.");
        error.status = 400;
        throw error;
    }

    const response = await ApifilmspublicfilmIdreviewsreviewerIdeditrequests.updateReviewRequestStatus(status, filmId, reviewerId, loggedUserId);

    utils.writeJson(res, response, 204);
  } catch (err) {
    const status = err.status;
    if (status) {
      const errorResponse = new ErrorResponse(status, err.message);
      return utils.writeJson(res, errorResponse, errorResponse.code);
    } else {
      const errorResponse = new ErrorResponse(500, err.message)
      utils.writeJson(res, errorResponse, errorResponse.code);
    }
  }
};
