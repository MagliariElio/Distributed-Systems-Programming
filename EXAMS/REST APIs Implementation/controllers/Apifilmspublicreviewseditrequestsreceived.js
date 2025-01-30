'use strict';

var utils = require('../utils/writer.js');
var Apifilmspublicreviewseditrequestsreceived = require('../service/ApifilmspublicreviewseditrequestsreceivedService');
const ErrorsPage = require('../utils/ErrorsPage');
const dbUtils = require('../utils/DbUtils');
const ErrorResponse = require('../components/ErrorResponse');

module.exports.getReviewRequestsForFilm = async function getReviewRequestsForFilm(req, res, next) {
  try {
    // Check if filmId, reviewerId, pageNo, and limit are integers
    if (req.query.filmId && (isNaN(req.query.filmId) || parseInt(req.query.filmId) < 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_FILM_ID);
      error.status = 400;
      throw error;
    }

    if (req.query.reviewerId && (isNaN(req.query.reviewerId) || parseInt(req.query.reviewerId) < 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_REVIEWER_ID);
      error.status = 400;
      throw error;
    }

    if (req.query.pageNo && (isNaN(req.query.pageNo) || parseInt(req.query.pageNo) <= 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_PAGE_NO);
      error.status = 400;
      throw error;
    }

    if (req.query.limit && (isNaN(req.query.limit) || parseInt(req.query.limit) <= 0)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_LIMIT);
      error.status = 400;
      throw error;
    }

    // Check if status is a string
    if (req.query.status && typeof req.query.status !== 'string') {
      const error = new Error(ErrorsPage.ERROR_INVALID_STATUS);
      error.status = 400;
      throw error;
    }
    
    const filmId = req.query.filmId ? parseInt(req.query.filmId) : undefined;
    const reviewerId = req.query.reviewerId ? parseInt(req.query.reviewerId) : undefined;
    const pageNo = req.query.pageNo ? parseInt(req.query.pageNo) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    let status = req.query.status;

    // Convert the status
    if (status) {
      switch (status.toLowerCase()) {
        case dbUtils.EditRequestStatus.PENDING:
          // Handle the case where status is 0 (Pending)
          status = 0;
          break;
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
          const error = new Error("The status must be one of 'accepted', 'rejected', or 'pending'. Other values are not accepted.");
          error.status = 400;
          throw error;
      }
    }

    const loggedUserId = req.user?.id;

    const response = await Apifilmspublicreviewseditrequestsreceived.getReviewRequestsForFilm(filmId, reviewerId, pageNo, limit, status, loggedUserId);

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
