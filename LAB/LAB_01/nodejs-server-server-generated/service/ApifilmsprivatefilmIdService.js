'use strict';

const dbUtils = require('../utils/db-utils')

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
      const error = new Error(`The requested film could not be found or it is private.`);
      error.status = 404;
      throw error;
    }

    if (film.owner !== loggedUserId) {
      const error = new Error(`You do not have permission to access this resource.`);
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
      const error = new Error(`The requested film could not be found or it is private.`);
      error.status = 404
      throw error
    } else if (film.owner != loggedUserId) {
      const error = new Error(`You do not have permission to access this resource.`);
      error.status = 403
      throw error
    } else {
      return film
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
    if (body.private == false) {
      const error = new Error(`A conflict occurred due to an existing resource or data inconsistency. The 'private' field cannot be changed. Please check the resource identifiers or data.`);
      error.status = 409;
      throw error;
    }

    const sqlSelect = 'SELECT * FROM films WHERE id = ? AND private = 1';
    var film = await dbUtils.dbGetAsync(sqlSelect, [filmId]);

    if (!film) {
      const error = new Error('The requested film could not be found or it is private');
      error.status = 404;
      throw error;
    } else if (film.owner != loggedUserId) {
      const error = new Error(`You do not have permission to access this resource.`);
      error.status = 403;
      throw error;
    }

    var sqlUpdate = 'UPDATE films SET title = ?';
    var parameters = [body.title];

    if (body.watchDate) {
      sqlUpdate = sqlUpdate.concat(', watchDate = ?');
      parameters.push(body.watchDate);
    }

    if (body.rating) {
      sqlUpdate = sqlUpdate.concat(', rating = ?');
      parameters.push(body.rating);
    }

    if (body.favorite) {
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

