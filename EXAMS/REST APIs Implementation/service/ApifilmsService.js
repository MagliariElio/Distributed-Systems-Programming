'use strict';

const dbUtils = require('../utils/DbUtils');

/**
 * Create a new film
 * A new film is created by the authenticated user (who becomes the owner).
 *
 * body FilmCreate Representation of the film to be created (with no id because it is assigned by the service)
 * returns Film
 **/
exports.createFilm = async function (film, ownerId) {
  try {
    const sql = 'INSERT INTO films(title, owner, private, watchDate, rating, favorite) VALUES(?,?,?,?,?,?)';

    // These fields are available only if the film is private
    if (!film.private) {
      film.watchDate = null;
      film.rating = null;
      film.favorite = null;
    }

    const id = await dbUtils.dbRunAsync(sql, [film.title, ownerId, film.private, film.watchDate, film.rating, film.favorite]);

    film.id = id;
    film.owner = ownerId;

    return dbUtils.mapObjToFilm(film);
  } catch (err) {
    throw new Error(`Error creating film: ${err.message}`);
  }
}

