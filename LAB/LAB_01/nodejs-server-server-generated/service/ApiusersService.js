'use strict';


/**
 * Get information about the users
 * The available information (passwords excluded) about all the users is retrieved. This operation is available only to authenticated users. 
 *
 * returns Users
 **/
exports.getUsers = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "password" : "password",
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "email" : ""
}, {
  "password" : "password",
  "$schema" : "$schema",
  "name" : "name",
  "self" : "http://example.com/aeiou",
  "id" : 0,
  "email" : ""
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

