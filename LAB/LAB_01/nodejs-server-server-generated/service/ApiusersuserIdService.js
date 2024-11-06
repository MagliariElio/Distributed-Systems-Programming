'use strict';


/**
 * Get information about a user
 * The available information (password excluded) about the user specified by userId is retrieved. This operation requires authentication. 
 *
 * userId Long ID of the user to get
 * returns User
 **/
exports.getSingleUser = function(userId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "password" : "password",
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "email" : ""
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

