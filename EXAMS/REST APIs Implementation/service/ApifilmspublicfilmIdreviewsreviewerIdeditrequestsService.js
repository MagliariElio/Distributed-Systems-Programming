'use strict';

const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');

/**
 * Get a specific edit review request.
 * Retrieve the details of a specific edit review request for the public film identified by `filmId`. This request returns information about the edit review request, such as the deadline, the status, and associated reviewer ID. Only the film owner and the reviewer who made the edit review request can access this resource. 
 *
 * filmId Long The ID of the film. This ID is used to retrieve the specific edit request for the film's review.
 * reviewerId Long ID of the user to whom the review has been issued.
 * loggedUserId Long ID of the logged user
 * returns EditReviewRequestDetails
 **/
exports.getReviewModificationRequest = async function (filmId, reviewerId, loggedUserId) {
  try {
    const sqlSelectReview = 'SELECT * FROM reviews WHERE filmId = ? AND reviewerId = ?';
    const rowReview = await dbUtils.dbGetAsync(sqlSelectReview, [filmId, loggedUserId]);

    const sqlSelectFilm = 'SELECT * FROM films WHERE id = ?';
    const rowFilm = await dbUtils.dbGetAsync(sqlSelectFilm, [filmId]);

    // If the user is not the owner and a reviewer of the film then it is not authorized to access to this resource 
    if (!rowReview && !rowFilm && rowFilm.owner !== loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_UNAUTHORIZED_EDIT_REQUEST_ACCESS);
      error.status = 403;
      throw error;
    }

    const sqlSelectEditRevReq = 'SELECT * FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?';
    const row = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, reviewerId]);

    if (!row) {
      const error = new Error(ErrorsPage.ERROR_NO_EDIT_REVIEW_REQUEST_FOUND);
      error.status = 404;
      throw error;
    }

    const requestCheck = dbUtils.mapObjToEditReviewRequest(row, loggedUserId, rowFilm.owner === loggedUserId);
    await this.checkDeadlineRequest(requestCheck);
    
    const rowCheck = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, reviewerId]);
    const request = dbUtils.mapObjToEditReviewRequest(rowCheck, loggedUserId, rowFilm.owner === loggedUserId);

    return request;
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error getting the edit review request: ${err.message}`);
    }
  }
}

/**
 * Accept or reject an edit review request.
 * 
 * @param {string} status - The status of the edit review request. It determines whether the request is being accepted or rejected:
 *   - 'accepted': The request is accepted, meaning the proposed changes to the review will be applied.
 *   - 'rejected': The request is rejected, meaning the proposed changes to the review will not be applied.
 * 
 * @param {string} filmId - The ID of the film. This ID is used to associate the edit request with the specific film's review and retrieve the relevant data.
 * @param {number} reviewerId - The ID of the user who made the review modification request. The request can only be accepted or rejected by the film's owner.
 * @param {number} loggedUserId - The ID of the logged user. This is typically the owner of the film who can accept or reject the edit request.
 * 
 * @returns {void} - No response value is expected for this operation.
 */
exports.updateReviewRequestStatus = async function (status, filmId, reviewerId, loggedUserId) {
  try {
    const sqlSelectFilm = 'SELECT * FROM films WHERE id = ?';
    const rowFilm = await dbUtils.dbGetAsync(sqlSelectFilm, [filmId]);

    // If the film does not exist
    if (!rowFilm) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
      error.status = 404;
      throw error;
    }

    // If the user is not the owner then it is not authorized to access to this resource 
    if (rowFilm.owner !== loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_UNAUTHORIZED_EDIT_REQUEST_ACTION);
      error.status = 403;
      throw error;
    }

    const sqlSelectEditRevReq = 'SELECT * FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?';
    const row = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, reviewerId]);
    let request = dbUtils.mapObjToEditReviewRequest(row, loggedUserId, rowFilm.owner === loggedUserId);

    if (!request) {
      const error = new Error(ErrorsPage.ERROR_NO_EDIT_REVIEW_REQUEST_FOUND);
      error.status = 404;
      throw error;
    }

    // Check if the edit review request is expired
    request = await this.checkDeadlineRequest(request);

    // If the edit review request is rejected or expired
    if (request.status === dbUtils.EditRequestStatus.REJECTED) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REVIEW_REQUEST_REJECTED);
      error.status = 409;
      throw error;
    }

    // If the edit review request is accepted
    else if (request.status === dbUtils.EditRequestStatus.ACCEPTED) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REVIEW_REQUEST_ACCEPTED);
      error.status = 409;
      throw error;
    }

    // If the edit review request is in pending
    else {
      await dbUtils.dbRunAsync('BEGIN TRANSACTION');

      try {
        // If the status is accepted, then the review is set to completed as false
        if (status === 2) {
          const sqlUpdateReview = 'UPDATE reviews SET completed = 0 WHERE filmId = ? AND reviewerId = ?';
          await dbUtils.dbRunAsync(sqlUpdateReview, [filmId, reviewerId]);
        }

        const sqlUpdateEditRevReq = 'UPDATE editReviewsRequests SET status = ? WHERE filmId = ? AND reviewerId = ?';
        await dbUtils.dbRunAsync(sqlUpdateEditRevReq, [status, filmId, reviewerId]);
      } catch (err) {
        await dbUtils.dbRunAsync('ROLLBACK');

        const error = new Error(err.message);
        error.status = 500;
        throw error;
      }

      await dbUtils.dbRunAsync('COMMIT');
    }

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error updating the edit review request: ${err.message}`);
    }
  }
}

/**
 * Service function to check if the deadline for an edit review request has passed.
 * If the deadline has passed, it automatically rejects the request by updating the status in the database.
 * 
 * @param {*} request - The edit review request object containing the details of the request, including the deadline.
 * @returns {Promise<Object>} - The updated request object, with its status set to "REJECTED" if the deadline has passed.
 * 
 * The function compares the current date with the deadline from the request. If the deadline is expired,
 * it automatically updates the request's status in the database to "REJECTED" (status 1).
 */
exports.checkDeadlineRequest = async function (request) {
  const filmId = request.filmId;
  const reviewerId = request.reviewerId;

  // Check the deadline with the current date
  const currentDate = new Date();
  const deadlineDate = new Date(request.deadline);

  // If the deadline is expired then reject automatically the edit review request
  if (deadlineDate < currentDate) {
    const sqlUpdate = 'UPDATE editReviewsRequests SET status = 1 WHERE filmId = ? AND reviewerId = ?';
    await dbUtils.dbRunAsync(sqlUpdate, [filmId, reviewerId]);
    request.status = dbUtils.EditRequestStatus.REJECTED;
  }

  return request;
}