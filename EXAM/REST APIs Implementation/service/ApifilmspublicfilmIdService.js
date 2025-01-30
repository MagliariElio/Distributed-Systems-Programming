'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Delete a public film
 * The public film with ID filmId is deleted. This operation can only be performed by the owner. 
 *
 * filmId Long ID of the film to delete
 * no response value expected for this operation
 **/
exports.deleteSinglePublicFilm = async function (filmId, loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM films WHERE id = ? AND private = 0';
    const film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND_OR_PRIVATE);
      error.status = 404;
      throw error;
    }

    if (film.owner !== loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    }

    const sqlDelete = 'DELETE FROM films WHERE id = ?';
    await dbUtils.dbRunAsync(sqlDelete, [filmId]);

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error deleting film: ${err.message}`);
    }
  }
}


/**
 * Retrieve a public film
 * The public film with ID filmId is retrieved. This operation does not require authentication.
 *
 * filmId Long ID of the film to retrieve
 * returns Film
 **/
exports.getSinglePublicFilm = async function (filmId) {
  try {
    const sql = 'SELECT * FROM films WHERE id = ? and private = 0';
    const row = await dbUtils.dbGetAsync(sql, [filmId]);

    if (!row) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND_OR_PRIVATE);
      error.status = 404;
      throw error;
    }

    const film = dbUtils.mapObjToFilm(row);

    return film
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching public film: ${err.message}`);
    }
  }
}


/**
 * Update a public film
 * The public film with ID filmId is updated. This operation does not allow changing its visibility.  This operation can be performed only by the owner. 
 *
 * body FilmUpdate The updated film object that needs to replace the old object
 * filmId Long ID of the film to update
 * no response value expected for this operation
 **/
exports.updateSinglePublicFilm = async function (body, filmId, loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM films WHERE id = ?';
    var film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
      error.status = 404;
      throw error;
    } else if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    } else if (film.private === 1) {
      const error = new Error(ErrorsPage.ERROR_UPDATE_FILM_PRIVATE);
      error.status = 409;
      throw error;
    }

    const sqlUpdate = 'UPDATE films SET title = ? WHERE id = ? AND owner = ?';
    await dbUtils.dbRunAsync(sqlUpdate, [body.title, filmId, film.owner]);

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error updating the public film: ${err.message}`);
    }
  }
}

