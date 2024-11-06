'use strict';


/**
 * Delete a public film
 * The public film with ID filmId is deleted. This operation can only be performed by the owner. 
 *
 * filmId Long ID of the film to delete
 * no response value expected for this operation
 **/
exports.deleteSinglePublicFilm = function(filmId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Retrieve a public film
 * The public film with ID filmId is retrieved. This operation does not require authentication.
 *
 * filmId Long ID of the film to retrieve
 * returns Film
 **/
exports.getSinglePublicFilm = function(filmId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "owner" : 6,
  "private" : true,
  "watchDate" : "2000-01-23",
  "$schema" : "$schema",
  "reviews" : "http://example.com/aeiou",
  "rating" : 2,
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "title" : "title",
  "favorite" : false
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update a public film
 * The public film with ID filmId is updated. This operation does not allow changing its visibility.  This operation can be performed only by the owner. 
 *
 * body Film The updated film object that needs to replace the old object
 * filmId Long ID of the film to update
 * no response value expected for this operation
 **/
exports.updateSinglePublicFilm = function(body,filmId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

