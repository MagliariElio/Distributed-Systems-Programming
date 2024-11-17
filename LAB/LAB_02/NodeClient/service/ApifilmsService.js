'use strict';

const dbUtils = require('../utils/DbUtils')

/**
 * Create a new film
 * A new film is created by the authenticated user (who becomes the owner).
 *
 * body FilmCreate Representation of the film to be created (with no id because it is assigned by the service)
 * returns Film
 **/
exports.createFilm = async function (film, owner) {
  try {
    const sql = 'INSERT INTO films(title, owner, private, watchDate, rating, favorite) VALUES(?,?,?,?,?,?)';
    const id = await dbUtils.dbRunAsync(sql, [film.title, owner, film.private, film.watchDate, film.rating, film.favorite]);
    
    film.id = id
    film.owner = owner
    
    return dbUtils.mapObjToFilm(film);
  } catch (err) {
    throw new Error(`Error creating film: ${err.message}`);
  }
}

