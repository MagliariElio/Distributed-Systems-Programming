'use strict';


/**
 * Delete a private film
 * The private film with ID filmId is deleted. This operation can only be performed by the owner. 
 *
 * filmId Long ID of the film to delete
 * no response value expected for this operation
 **/
exports.deleteSinglePrivateFilm = function(filmId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Retrieve a private film
 * The private film with ID filmId is retrieved. This operation can be performed on the film if the user who performs the operation is the film's owner. 
 *
 * filmId Long ID of the film to retrieve
 * returns Film
 **/
exports.getSinglePrivateFilm = function(filmId) {
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
 * Update a private film
 * The private film with ID filmId is updated. This operation does not allow changing its visibility.  This operation can be performed only by the owner. 
 *
 * body Film The updated film object that needs to replace the old object
 * filmId Long ID of the film to update
 * no response value expected for this operation
 **/
exports.updateSinglePrivateFilm = function(body,filmId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

