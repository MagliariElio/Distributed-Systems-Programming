'use strict';

const dbUtils = require('../utils/DbUtils')

/**
 * Retrieve the public films
 * The public films (i.e., the films that are visible for all the users of the service) are retrieved.  This operation does not require authentication. A pagination mechanism is used to limit the size of messages. 
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns Films
 **/
exports.getPublicFilms = async function(pageNo) {
  try {
    const filmsPerPage = 10;
    const offset = (pageNo - 1) * filmsPerPage;

    const sql = `
      SELECT * FROM films 
      WHERE private = 0 
      LIMIT ? OFFSET ?
    `;
    const films = await dbUtils.dbAllAsync(sql, [filmsPerPage, offset]);

    const sqlCount = 'SELECT COUNT(*) AS totalItems FROM films WHERE private = 0';
    const countResult = await dbUtils.dbGetAsync(sqlCount, []);
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

