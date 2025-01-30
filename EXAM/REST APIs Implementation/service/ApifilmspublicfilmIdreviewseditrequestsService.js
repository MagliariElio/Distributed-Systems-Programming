'use strict';

const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');
const { checkDeadlineRequest } = require('./ApifilmspublicfilmIdreviewsreviewerIdeditrequestsService');

/**
 * Cancel an edit review request.
 * Cancel a review modification request submitted for the film identified by filmId. Only the reviewer who made the request can cancel it. 
 *
 * filmId String The ID of the film. This ID is used to associate the edit request with the specific film's review and retrieve.
 * loggedUserId Long ID of the logged user
 * no response value expected for this operation
 **/
exports.cancelReviewRequest = async function (filmId, loggedUserId) {
  try {
    // Check the status of the edit review request
    const sqlSelectEditRevReq = 'SELECT * FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?';
    const rowRequest = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, loggedUserId]);
    let request = dbUtils.mapObjToEditReviewRequest(rowRequest, loggedUserId, false);

    if (!request) {
      const error = new Error(ErrorsPage.ERROR_NO_EDIT_REVIEW_REQUEST_FOUND);
      error.status = 404;
      throw error;
    }

    request = await checkDeadlineRequest(request);

    // Edit Review Request has already rejected
    if (request.status == dbUtils.EditRequestStatus.REJECTED) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REQUEST_ALREADY_PROCESSED_REJECTED);
      error.status = 409;
      throw error;
    }

    // Edit Review Request has already accepted
    if (request.status == dbUtils.EditRequestStatus.ACCEPTED) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REQUEST_ALREADY_PROCESSED_ACCEPTED);
      error.status = 409;
      throw error;
    }

    const sqlDelete = `DELETE FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?`;
    await dbUtils.dbRunAsync(sqlDelete, [filmId, loggedUserId]);
    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error cancelling the edit review request: ${err.message}`);
    }
  }
}

/**
 * Request a modification to a film review.
 * Creates a edit request for a review of the public film identified by `filmId`. The request includes a deadline and is marked as `pending`. Only authenticated users who have completed a review for this film can make this request. 
 *
 * deadline Date Edit review request details, including the deadline.
 * filmId Long The ID of the film. This ID is used to associate the edit request with the specific film's review and retrieve.
 * loggedUserId Long ID of the logged user
 * returns EditReviewRequestDetails
 **/
exports.createReviewModificationRequest = async function (deadline, filmId, loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM reviews WHERE filmId = ? AND reviewerId = ?';
    const review = await dbUtils.dbGetAsync(sqlSelect, [filmId, loggedUserId]);

    // Check the deadline with the current date
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate <= currentDate) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REQUEST_REVIEW_DEADLINE);
      error.status = 400;
      throw error;
    }

    if (!review) {
      const error = new Error(ErrorsPage.ERROR_REVIEW_NOT_FOUND);
      error.status = 404;
      throw error;
    }

    if (review.completed == 0) {
      const error = new Error(ErrorsPage.ERROR_REVIEW_NOT_COMPLETED);
      error.status = 409;
      throw error;
    }

    // Check the status of the edit review request
    const sqlSelectEditRevReq = 'SELECT * FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?';
    const rowRequest = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, loggedUserId]);

    // Edit Review Request in pending
    if (rowRequest?.status == 0) {
      const error = new Error(ErrorsPage.ERROR_EDIT_REVIEW_REQUEST_PENDING);
      error.status = 409;
      throw error;
    }

    // If the status is equal to 1 or 2 then update to 0 (pending)
    if (rowRequest?.status == 1 || rowRequest?.status == 2) {
      const sqlUpdate = 'UPDATE editReviewsRequests SET deadline = ?, status = 0 WHERE filmId = ? AND reviewerId = ?';
      await dbUtils.dbRunAsync(sqlUpdate, [deadline, filmId, loggedUserId]);

    } else {
      const sql = 'INSERT INTO editReviewsRequests(filmId, reviewerId, deadline) VALUES(?,?,?)';
      await dbUtils.dbRunAsync(sql, [filmId, loggedUserId, deadline]);
    }

    // Check if the logged user is the owner of the film
    const sqlSelectFilm = 'SELECT owner FROM films WHERE id = ?';
    const rowOwner = await dbUtils.dbGetAsync(sqlSelectFilm, [filmId]);
    
    let isOwner = false;
    if(rowOwner && rowOwner.owner === loggedUserId) {
      isOwner = true;
    }

    const row = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, loggedUserId]);
    const request = dbUtils.mapObjToEditReviewRequest(row, loggedUserId, isOwner);

    return request;
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error adding an edit review request: ${err.message}`);
    }
  }
}

