'use strict';


/**
 * Retrieve the public films that the logged-in user has been invited to review
 * The public films that the logged-in user has been invited to review are retrieved. A pagination mechanism is used to limit the size of messages. 
 *
 * pageNo Integer The id of the requested page (if absent, the first page is returned) (optional)
 * returns Films
 **/
exports.getInvitedFilms = function(pageNo) {
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

