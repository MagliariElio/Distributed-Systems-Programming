'use strict';

const dbUtils = require('../utils/DbUtils')

/**
 * Retrieve the private films of the logged-in user
 * The private films of the logged-in user are retrieved. A pagination mechanism is used to limit the size of messages. 
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns Films
 **/
exports.getPrivateFilms = async function (loggedUserId, pageNo) {
  try {
    const filmsPerPage = 10;
    const offset = (pageNo - 1) * filmsPerPage;

    const sql = `
      SELECT * FROM films 
      WHERE private = 1 AND owner = ? 
      LIMIT ? OFFSET ?
    `;
    const films = await dbUtils.dbAllAsync(sql, [loggedUserId, filmsPerPage, offset]);

    const sqlCount = 'SELECT COUNT(*) AS totalItems FROM films WHERE private = 1 AND owner = ?';
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
      throw new Error(`Error fetching private films: ${err.message}`);
    }
  }
}

