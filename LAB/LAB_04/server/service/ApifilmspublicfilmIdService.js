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
exports.getSinglePublicFilm = async function (loggedUserId, filmId) {
  try {
    const sql = 'SELECT * FROM films WHERE id = ? and private = 0';
    const row = await dbUtils.dbGetAsync(sql, [filmId]);

    if (!row) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND_OR_PRIVATE);
      error.status = 404;
      throw error;
    }

    if (loggedUserId) {
      const sqlActive = 'SELECT COUNT(*) AS count FROM reviews WHERE reviewerId = ? AND filmId = ? AND active = 1 AND completed = 0';
      const activeInvitation = await dbUtils.dbGetAsync(sqlActive, [loggedUserId, filmId]);

      row.active = activeInvitation.count > 0;      // If the counter is higher than 0 so the film is active
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
    if (body.private == false) {
      const error = new Error(ErrorsPage.ERROR_CONFLICT_PRIVATE_FIELD_CHANGE);
      error.status = 409;
      throw error;
    }

    const sqlSelect = 'SELECT * FROM films WHERE id = ? AND private = 0';
    var film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND_OR_PRIVATE);
      error.status = 404;
      throw error;
    } else if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error;
    }

    var sqlUpdate = 'UPDATE films SET title = ?';
    var parameters = [body.title];

    if (body.watchDate !== undefined) {
      sqlUpdate = sqlUpdate.concat(', watchDate = ?');
      parameters.push(body.watchDate);
    }

    if (body.rating !== undefined) {
      sqlUpdate = sqlUpdate.concat(', rating = ?');
      parameters.push(body.rating);
    }

    if (body.favorite !== undefined) {
      sqlUpdate = sqlUpdate.concat(', favorite = ?');
      parameters.push(body.favorite);
    }

    sqlUpdate = sqlUpdate.concat(' WHERE id = ? AND owner = ?');
    parameters.push(filmId);
    parameters.push(film.owner);

    await dbUtils.dbRunAsync(sqlUpdate, parameters);

    film.title = body.title;
    film.watchDate = body.watchDate;
    film.rating = body.rating;
    film.favorite = body.favorite;

    // film = dbUtils.mapObjToFilm(film);
    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error updating film: ${err.message}`);
    }
  }
}

