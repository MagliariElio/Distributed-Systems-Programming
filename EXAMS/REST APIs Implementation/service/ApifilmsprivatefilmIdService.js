'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Delete a private film
 * The private film with ID filmId is deleted. This operation can only be performed by the owner. 
 *
 * filmId Long ID of the film to delete
 * no response value expected for this operation
 **/
exports.deleteSinglePrivateFilm = async function (filmId, loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM films WHERE id = ? AND private = 1';
    const film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
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
 * Retrieve a private film
 * The private film with ID filmId is retrieved. This operation can be performed on the film if the user who performs the operation is the film's owner. 
 *
 * filmId Long ID of the film to retrieve
 * returns Film
 **/
exports.getSinglePrivateFilm = async function (filmId, loggedUserId) {
  try {
    const sql = 'SELECT * FROM films WHERE id = ? and private = 1';
    const row = await dbUtils.dbGetAsync(sql, [filmId]);
    const film = dbUtils.mapObjToFilm(row);

    if (!film) {
      const error = new Error(ErrorsPage.ERROR_FILM_NOT_FOUND);
      error.status = 404;
      throw error
    } else if (film.owner != loggedUserId) {
      const error = new Error(ErrorsPage.ERROR_NO_PERMISSION);
      error.status = 403;
      throw error
    } else {
      return film;
    }

  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching private film: ${err.message}`);
    }
  }
}

/**
 * Update a private film
 * The private film with ID filmId is updated. This operation does not allow changing its visibility.  This operation can be performed only by the owner. 
 *
 * body FilmUpdate The updated film object that needs to replace the old object
 * filmId Long ID of the film to update
 * no response value expected for this operation
 **/
exports.updateSinglePrivateFilm = async function (body, filmId, loggedUserId) {
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
    } else if (film.private === 0) {
      const error = new Error(ErrorsPage.ERROR_UPDATE_FILM_PUBLIC);
      error.status = 409;
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

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error updating the private film: ${err.message}`);
    }
  }
}

