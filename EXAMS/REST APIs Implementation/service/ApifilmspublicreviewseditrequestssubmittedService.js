'use strict';

const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');
const { checkDeadlineRequest } = require('./ApifilmspublicfilmIdreviewsreviewerIdeditrequestsService');

/**
 * Get edit review requests made by the reviewer.
 * The `reviewer` retrieves the status of their submitted edit review requests. It can be filtered the requests by status (pending, accepted, rejected), id of film and paginate the results using pageNo and limit. If pagination is not provided, the first page with default items will be returned. Only `authenticated users` can make this request. 
 *
 * filmId Long The unique identifier (ID) of the film. This ID is used to retrieve all review edit requests associated with the specified film. (optional)
 * pageNo Integer The page number of the results. If not provided, the first page will be returned by default. (optional)
 * limit Integer The number of requests to return per page. If not provided, a default number of items will be returned. (optional)
 * status String Filter the results based on the status of the edit review requests. Can be one of the following: - `pending`: Requests that are awaiting approval. - `accepted`: Requests that have been approved. - `rejected`: Requests that have been rejected.  (optional)
 * loggedUserId Long ID of the logged user
 * returns EditReviewRequests
 **/
exports.getReviewRequestsByReviewer = async function (filmId, pageNo, limit, status, loggedUserId) {
  try {

    if (filmId) {
      const sqlFilm = `SELECT * FROM films WHERE id = ?`;
      const film = await dbUtils.dbGetAsync(sqlFilm, [filmId]);

      // The film does not exist
      if (!film) {
        const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
        error.status = 404;
        throw error;
      }
    }

    const editReviewRequestsPerPage = limit ? limit : 10;
    const offset = (pageNo - 1) * editReviewRequestsPerPage;

    let params = [loggedUserId];
    let paramsCount = [loggedUserId];
    let statusCondition = '';
    let filmIdCondition = '';

    if (filmId !== undefined) {
      filmIdCondition = "AND filmId = ?";
      params.push(filmId);
      paramsCount.push(filmId);
    }

    if (status !== undefined) {
      statusCondition = " AND status = ?";
      params.push(status);
      paramsCount.push(status);
    }

    params.push(editReviewRequestsPerPage);
    params.push(offset);

    const sql = `
          SELECT e.*, f.owner
          FROM editReviewsRequests AS e INNER JOIN films AS f ON e.filmId = f.id 
          WHERE reviewerId = ? ${filmIdCondition}${statusCondition} 
          LIMIT ? OFFSET ?
        `;
    const requests = await dbUtils.dbAllAsync(sql, params);

    const sqlCount = `
          SELECT COUNT(*) AS totalItems
          FROM editReviewsRequests
          WHERE reviewerId = ? ${filmIdCondition}${statusCondition}
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
      requests: await Promise.all(requests.map(async r => {
        const req = dbUtils.mapObjToEditReviewRequest(r, loggedUserId, r.owner === loggedUserId);
        const checkedReq = await checkDeadlineRequest(req);
        return checkedReq;
      }))
    };

    return dbUtils.mapObjToEditReviewRequests(row, false);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching edit review requests submitted: ${err.message}`);
    }
  }
}

