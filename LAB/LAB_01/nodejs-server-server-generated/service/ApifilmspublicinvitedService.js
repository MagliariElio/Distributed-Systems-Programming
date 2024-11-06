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
  }, {
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
  } ],
  "totalItems" : 0,
  "$schema" : "$schema",
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

