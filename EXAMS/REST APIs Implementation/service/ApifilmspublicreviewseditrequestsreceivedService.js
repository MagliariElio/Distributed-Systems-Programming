'use strict';

const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');
const { checkDeadlineRequest } = require('./ApifilmspublicfilmIdreviewsreviewerIdeditrequestsService');

/**
 * Get all edit review requests received for your own films.
 * The `film owner` retrieves all edit review requests for the specific film identified by `filmId`. You can filter requests by status (`pending`, `accepted`, `rejected`), id of film and paginate the results using `pageNo` and `limit`. If pagination is not provided, the first page with default items will be returned. Only `authenticated users` can make this request. 
 *
 * filmId Long The unique identifier (ID) of the film. This ID is used to retrieve all review edit requests associated with the specified film. (optional)
 * reviewerId Long The unique identifier (ID) of the reviewer. This ID is used to retrieve all review edit requests submitted by the specified reviewer. (optional)
 * pageNo Integer The page number of the results. If not provided, the first page will be returned by default. (optional)
 * limit Integer The number of requests to return per page. If not provided, a default number of items will be returned. (optional)
 * status String Filter the results based on the status of the edit review requests. Can be one of the following: - `pending`: Requests that are awaiting approval. - `accepted`: Requests that have been approved. - `rejected`: Requests that have been rejected.  (optional)
 * loggedUserId Long ID of the logged user
 * returns EditReviewRequests
 **/
exports.getReviewRequestsForFilm = async function (filmId, reviewerId, pageNo, limit, status, loggedUserId) {
  try {
    var filmIdsList = [];

    if (filmId) {
      const sqlFilm = `SELECT * FROM films WHERE id = ?`;
      const film = await dbUtils.dbGetAsync(sqlFilm, [filmId]);

      filmIdsList.push(filmId); // only one film id

      // The film does not exist
      if (!film) {
        const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
        error.status = 404;
        throw error;
      }

      // The logged user is not the owner of the film
      if (film.owner !== loggedUserId) {
        const error = new Error(ErrorsPage.ERROR_UNAUTHORIZED_EDIT_REQUEST_ACTION);
        error.status = 403;
        throw error;
      }
    } else {
      const sqlFilms = `SELECT DISTINCT(id) FROM films WHERE owner = ?`;
      filmIdsList = await dbUtils.dbAllAsync(sqlFilms, [loggedUserId]);
      filmIdsList = filmIdsList.map(f => f.id);
    }

    const editReviewRequestsPerPage = limit ? limit : 10;
    const offset = (pageNo - 1) * editReviewRequestsPerPage;

    let params = [...filmIdsList, editReviewRequestsPerPage, offset];
    let paramsCount = [...filmIdsList];
    let statusAndReviewerIdCondition = '';

    const placeholdersFilmListId = filmIdsList.map(() => '?').join(', ');

    if (status !== undefined) {
      statusAndReviewerIdCondition += " AND status = ?";
      params.splice(params.length - 2, 0, status);
      paramsCount.push(status);
    }

    if(reviewerId !== undefined) {
      statusAndReviewerIdCondition += " AND reviewerId = ?";
      params.splice(params.length - 2, 0, reviewerId);
      paramsCount.push(reviewerId);
    }

    const sql = `SELECT * FROM editReviewsRequests WHERE filmId IN (${placeholdersFilmListId})${statusAndReviewerIdCondition} LIMIT ? OFFSET ?`;
    const requests = await dbUtils.dbAllAsync(sql, params);

    const sqlCount = `
        SELECT COUNT(*) AS totalItems
        FROM editReviewsRequests
        WHERE filmId IN (${placeholdersFilmListId})${statusAndReviewerIdCondition}
      `;
    const countResult = await dbUtils.dbGetAsync(sqlCount, paramsCount);
    const totalItems = countResult.totalItems;
    const totalPages = Math.ceil(totalItems / editReviewRequestsPerPage);

    let row = {
      totalPages: totalPages,
      currentPage: pageNo,
      totalItems: totalItems,
      filmId: filmId,
      limit: limit,
      status: status,
      reviewerId: reviewerId,
      requests: await Promise.all(requests.map(async r => {
        const req = dbUtils.mapObjToEditReviewRequest(r, loggedUserId, true);
        const checkedReq = await checkDeadlineRequest(req);
        return checkedReq;
      }))
    };

    return dbUtils.mapObjToEditReviewRequests(row, true);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching edit review requests received: ${err.message}`);
    }
  }
}

