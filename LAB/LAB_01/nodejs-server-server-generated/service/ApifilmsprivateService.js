'use strict';


/**
 * Retrieve the private films of the logged-in user
 * The private films of the logged-in user are retrieved. A pagination mechanism is used to limit the size of messages. 
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns Films
 **/
exports.getPrivateFilms = function(pageNo) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "films" : [ {
    "private" : true,
    "reviews" : "http://example.com/aeiou",
    "self" : "http://example.com/aeiou",
    "update" : "http://example.com/aeiou",
    "id" : 0,
    "delete" : "http://example.com/aeiou"
  }, {
    "private" : true,
    "reviews" : "http://example.com/aeiou",
    "self" : "http://example.com/aeiou",
    "update" : "http://example.com/aeiou",
    "id" : 0,
    "delete" : "http://example.com/aeiou"
  } ],
  "totalItems" : 0,
  "$schema" : "$schema",
  "previous" : "http://example.com/aeiou",
  "totalPages" : 0,
  "currentPage" : 0
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

