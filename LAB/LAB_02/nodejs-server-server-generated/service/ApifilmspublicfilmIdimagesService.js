'use strict';


/**
 * Associate a new image to a public film
 * The image sent in request body is associated to the public film characterized by the ID specified in the path. Only the film owner can associate an image to the film.
 *
 * filmId Long ID of the film
 * returns Image
 **/
exports.addImage = function(filmId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "type" : "image/png",
  "delete" : "http://example.com/aeiou"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve a list of images for a public film
 * This operation retrieves a list of image structures associated with the public film with ID `filmId`. The response contains metadata for each image, such as its ID, type, and other relevant details, but not the actual image content itself. This operation does not require authentication.
 *
 * filmId Long ID of the film to retrieve the images
 * returns Images
 **/
exports.getImageListForPublicFilm = function(filmId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "type" : "image/png",
  "delete" : "http://example.com/aeiou"
}, {
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "type" : "image/png",
  "delete" : "http://example.com/aeiou"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

