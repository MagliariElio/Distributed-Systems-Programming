'use strict';


/**
 * Retrieve the Film Manager
 * The Film Manager resource, representing the entry point of the REST interface, with ID filmId is retrieved.  This operation does not require authentication. 
 *
 * returns FilmManager
 **/
exports.getFilmManager = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "films" : "http://example.com/aeiou",
  "usersAuthenticator" : "http://example.com/aeiou",
  "privateFilms" : "http://example.com/aeiou",
  "publicFilms" : "http://example.com/aeiou",
  "invitedPublicFilms" : "http://example.com/aeiou",
  "reviewAssignments" : "http://example.com/aeiou",
  "users" : "http://example.com/aeiou"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

