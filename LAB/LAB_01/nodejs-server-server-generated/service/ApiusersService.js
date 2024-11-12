'use strict';
const dbUtils = require('../utils/db-utils')

/**
 * Get information about the users
 * The available information (passwords excluded) about all the users is retrieved. This operation is available only to authenticated users. 
 *
 * returns Users
 **/
exports.getUsers = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "totalItems" : 0,
  "$schema" : "$schema",
  "previous" : "http://example.com/aeiou",
  "totalPages" : 0,
  "currentPage" : 0,
  "users" : [ {
    "self" : "http://example.com/aeiou",
    "id" : 5
  }, {
    "self" : "http://example.com/aeiou",
    "id" : 5
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

