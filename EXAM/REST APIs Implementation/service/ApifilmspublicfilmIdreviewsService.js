'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Retrieve the list of all the reviews that have been issued/completed for a public film
 * All the reviews that have been issued/completed for the public film with ID filmId are retrieved. A pagination mechanism is used to limit the size of messages. This operation does not require authentication. 
 *
 * filmId Long ID of the film whose reviews must be retrieved
 * pageNo Integer ID of the requested page (if absent, the first page is returned) (optional)
 * loggedUserId Long ID of the logged user
 * returns Reviews
 **/
exports.getFilmReviews = async function (filmId, pageNo, loggedUserId) {
  try {
    const filmsPerPage = 10;
    const offset = (pageNo - 1) * filmsPerPage;

    const sql = `
      SELECT r.filmId, r.reviewerId, r.completed, r.reviewDate, r.rating, r.reviewText
      FROM reviews AS r INNER JOIN films AS f ON r.filmId = f.id
      WHERE r.filmId = ? AND f.private = 0
      LIMIT ? OFFSET ?
    `;
    const reviews = await dbUtils.dbAllAsync(sql, [filmId, filmsPerPage, offset]);

    const sqlCount = `
      SELECT COUNT(*) AS totalItems
      FROM reviews AS r INNER JOIN films AS f ON r.filmId = f.id
      WHERE r.filmId = ? AND f.private = 0
    `;
    const countResult = await dbUtils.dbGetAsync(sqlCount, [filmId]);
    const totalItems = countResult.totalItems;
    const totalPages = Math.ceil(totalItems / filmsPerPage);

    var row = {
      totalPages: totalPages,
      currentPage: pageNo,
      totalItems: totalItems,
      filmId: filmId,
      reviews: await Promise.all(reviews.map(async requestRow => {

        // Get Edit Request Review
        if (loggedUserId) {
          let isAuthorized = false;

          // Check if the logged user is the reviewer
          if (requestRow.reviewerId === loggedUserId) {
            isAuthorized = true;
          }

          const sqlSelectOwner = `SELECT owner FROM films WHERE id = ?`;
          const ownerRow = await dbUtils.dbGetAsync(sqlSelectOwner, [filmId]);

          // Check if the logged user is the owner of the film
          if (!isAuthorized && ownerRow.owner === loggedUserId) {
            isAuthorized = true;
          }

          if (isAuthorized) {
            const sqlSelectEditRevReq = `SELECT * FROM editReviewsRequests WHERE filmId = ? and reviewerId = ?`;
            const editReviewRequestRow = await dbUtils.dbGetAsync(sqlSelectEditRevReq, [filmId, requestRow.reviewerId]);

            const editReviewRequest = dbUtils.mapObjToEditReviewRequest(editReviewRequestRow, loggedUserId, ownerRow.owner === loggedUserId);
            requestRow.editReviewRequest = editReviewRequest;
          }
        }

        return dbUtils.mapObjToReview(requestRow);
      }))
    };

    return dbUtils.mapObjToReviews(row);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching reviews: ${err.message}`);
    }
  }
}

/**
 * Issue film review to some users
 * The film with ID filmId is assigned to one or more users for review and the corresponding reviews are created. The users are specified in the review representations in the request body. This operation can only be performed by the owner. 
 *
 * list List of reviewer IDs to assign reviews to
 * filmId Long ID of the film
 * loggedUserId Long ID of the logged user
 * returns List
 **/
exports.issueFilmReview = async function (list, filmId, loggedUserId) {
  try {
    if (list.length == 0) {
      const error = new Error(ErrorsPage.ERROR_LIST_CANNOT_BE_EMPTY);
      error.status = 400;
      throw error;
    }

    const sqlSelect = 'SELECT * FROM films WHERE id = ?';
    var film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_ID_INVALID);
      error.status = 404;
      throw error;
    }

    if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_PERMISSION_REQUIRED);
      error.status = 403;
      throw error;
    }

    if (film.private) {
      const error = new Error(ErrorsPage.ERROR_FILM_PRIVATE_NO_REVIEWS);
      error.status = 409;
      throw error;
    }

    const batchSize = 20;
    for (let i = 0; i < list.length; i += batchSize) {
      const batch = list.slice(i, i + batchSize);
      const query = 'SELECT id FROM users WHERE id IN (' + batch.map(() => '?').join(', ') + ')';
      const results = await dbUtils.dbAllAsync(query, batch);

      if (results.length < batch.length) {
        const existingIds = new Set(results.map(row => row.id));
        const missingIds = batch.filter(id => !existingIds.has(id));

        if (missingIds.length > 0) {
          const error = new Error(ErrorsPage.formatErrorMissingReviewerIds(missingIds));
          error.status = 409;
          throw error;
        }
      }
    }

    await dbUtils.dbRunAsync('BEGIN TRANSACTION');

    const sql = 'INSERT INTO reviews(filmId, reviewerId) VALUES(?,?)';
    for (const reviewerId of list) {
      try {
        await dbUtils.dbRunAsync(sql, [filmId, reviewerId]);
      } catch (err) {
        await dbUtils.dbRunAsync('ROLLBACK');

        const error = new Error(ErrorsPage.formatErrorReviewAlreadyExists(filmId, reviewerId));
        error.status = 409;
        throw error;
      }
    }

    await dbUtils.dbRunAsync('COMMIT');

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error issuing film review: ${err.message}`);
    }
  }
}

/**
 * Complete a review
 * The review of the film with ID filmId and issued to the logged user is completed. This operation only allows setting the \"completed\" property to the \"true\" value, and changing the values of the \"reviewDate\", \"rating\", and \"reviewText\" properties. This operation can be performed only by the invited reviewer. 
 *
 * body ReviewUpdate The updated Review object
 * filmId Long ID of the film whose review must be completed
 * loggedUserId Long ID of the logged user
 * no response value expected for this operation
 **/
exports.updateSingleReview = async function (body, filmId, loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM reviews WHERE filmId = ? AND reviewerId = ?';
    var invitation = await dbUtils.dbGetAsync(sqlSelect, [filmId, loggedUserId]);

    if (!invitation) {
      const error = new Error(ErrorsPage.formatErrorNoReviewInvitation(loggedUserId, filmId));
      error.status = 404;
      throw error;
    }

    if (invitation.completed) {
      const error = new Error(ErrorsPage.formatErrorReviewAlreadyCompletedByReviewer(filmId, loggedUserId));
      error.status = 409;
      throw error;
    }

    try {
      await dbUtils.dbRunAsync('BEGIN TRANSACTION');

      // Update Review
      var sqlUpdate = 'UPDATE reviews SET completed = true, reviewDate = ?';
      var parameters = [body.reviewDate];

      if (body.rating) {
        sqlUpdate = sqlUpdate.concat(', rating = ?');
        parameters.push(body.rating);
      }

      if (body.reviewText) {
        sqlUpdate = sqlUpdate.concat(', reviewText = ?');
        parameters.push(body.reviewText);
      }

      sqlUpdate = sqlUpdate.concat(' WHERE filmId = ? AND reviewerId = ?');
      parameters.push(filmId);
      parameters.push(loggedUserId);

      await dbUtils.dbRunAsync(sqlUpdate, parameters);

      // Delete any existing Edit Review Request
      const sqlDeleteEditRevReq = 'DELETE FROM editReviewsRequests WHERE filmId = ? AND reviewerId = ?';
      await dbUtils.dbRunAsync(sqlDeleteEditRevReq, [filmId, loggedUserId]);

      await dbUtils.dbRunAsync('COMMIT');
    } catch (err) {
      await dbUtils.dbRunAsync('ROLLBACK');

      const error = new Error(err.message);
      error.status = 500;
      throw error;
    }

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error updating review: ${err.message}`);
    }
  }
}