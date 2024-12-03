'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Delete a review invitation
 * The review of the film with ID filmId and issued to the user with ID reviewerId is deleted. This operation can only be performed by the owner, and only if the review has not yet been completed by the reviewer. 
 *
 * filmId Long ID of the film whose review invitation must be deleted
 * reviewerId Long ID of the user to whom the review has been issued
 * loggedUserId Long ID of the logged user
 * no response value expected for this operation
 **/
exports.deleteSingleReview = async function (filmId, reviewerId, loggedUserId) {
  try {
    const sqlSelect = `SELECT * FROM films WHERE id = ?`;
    const film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.formatErrorFilmIdNotFound(filmId));
      error.status = 404;
      throw error;
    }

    if (film.owner !== loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    }

    const sql = `SELECT * FROM reviews WHERE filmId = ? AND reviewerId = ?`;
    const review = await dbUtils.dbGetAsync(sql, [filmId, reviewerId]);

    if (!review) {
      const error = new Error(ErrorsPage.ERROR_NO_PENDING_REVIEW_INVITATION);
      error.status = 404;
      throw error;
    }

    if (review.completed) {
      const error = new Error(ErrorsPage.ERROR_REVIEW_ALREADY_COMPLETED);
      error.status = 409;
      throw error;
    }

    const sqlDelete = `DELETE FROM reviews WHERE filmId = ? AND reviewerId = ?`;
    await dbUtils.dbRunAsync(sqlDelete, [filmId, reviewerId]);
    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error deleting pending review: ${err.message}`);
    }
  }
}

/**
 * Retrieve a review that has been issued/completed for a film
 * The review of the film with ID filmID issued to the user with ID reviewerId is retrieved. This operation does not require authentication. 
 *
 * filmId Long ID of the film whose reviews must be retrieved
 * reviewerId Long ID of the user to whom the review has been issued
 * returns Review
 **/
exports.getSingleReview = async function (filmId, reviewerId) {
  try {
    const sql = `SELECT * FROM reviews WHERE filmId = ? and reviewerId = ?`;
    const row = await dbUtils.dbGetAsync(sql, [filmId, reviewerId]);
    const review = dbUtils.mapObjToReview(row);

    if (!review) {
      const error = new Error(ErrorsPage.ERROR_REVIEW_NOT_FOUND);
      error.status = 404
      throw error
    } else {
      return review
    }
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching review: ${err.message}`);
    }
  }
}
