'use strict';


/**
 * Create a new film
 * A new film is created by the authenticated user (who becomes the owner).
 *
 * body Film Representation of the film to be created (with no id because it is assigned by the service)
 * returns Film
 **/
exports.createFilm = function(body) {
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

