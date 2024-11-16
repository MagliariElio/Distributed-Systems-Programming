'use strict';


/**
 * Delete an image associated to a public film
 * The image to be deleted is the one with ID `imageId`, associated to the film with ID `filmId`. Only the film owner can delete the image. 
 *
 * filmId Long ID of the film
 * imageId Long ID of the image
 * no response value expected for this operation
 **/
exports.deleteSingleImage = function(filmId,imageId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Retrieve an image associated to a public film
 * The image with ID `imageId`, associated to the film with ID `filmId`, is retrieved. In particular, by specifying the desired content type via the Accept header, the user can decide whether to retrieve the image data structure (json content type), which does not contain the image file, or the image file itself, in one of the supported image content types (image/png, image/jpg, and image/gif). Only the film owner or a film reviewer can perform this operation.
 *
 * filmId Long ID of the film
 * imageId Long ID of the image
 * returns Image
 **/
exports.getSingleImage = function(filmId,imageId) {
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

