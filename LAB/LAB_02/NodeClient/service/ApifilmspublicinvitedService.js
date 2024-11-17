'use strict';

const dbUtils = require('../utils/DbUtils')

/**
 * Retrieve the public films that the logged-in user has been invited to review
 * The public films that the logged-in user has been invited to review are retrieved. A pagination mechanism is used to limit the size of messages. 
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns Films
 **/
exports.getInvitedFilms = async function (loggedUserId, pageNo) {
  try {
    const filmsPerPage = 10;
    const offset = (pageNo - 1) * filmsPerPage;

    const sql = `
      SELECT f.id, f.title, f.owner, f.private, f.watchDate, f.rating, f.favorite 
      FROM reviews AS r INNER JOIN films AS f ON r.filmId = f.id
      WHERE r.reviewerId = ? AND f.private = 0 AND r.completed = 0
      LIMIT ? OFFSET ?
    `;

    const films = await dbUtils.dbAllAsync(sql, [loggedUserId, filmsPerPage, offset]);

    const sqlCount = `
      SELECT COUNT(*) AS totalItems 
      FROM reviews AS r INNER JOIN films AS f ON r.filmId = f.id
      WHERE r.reviewerId = ? AND f.private = 0 AND r.completed = 0
    `;
    const countResult = await dbUtils.dbGetAsync(sqlCount, [loggedUserId]);
    const totalItems = countResult.totalItems;
    const totalPages = Math.ceil(totalItems / filmsPerPage);

    var row = {
      totalPages: totalPages,
      currentPage: pageNo,
      totalItems: totalItems,
      films: films.map(row => dbUtils.mapObjToFilm(row))
    };

    return dbUtils.mapObjToFilms(row);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching public films: ${err.message}`);
    }
  }
}

