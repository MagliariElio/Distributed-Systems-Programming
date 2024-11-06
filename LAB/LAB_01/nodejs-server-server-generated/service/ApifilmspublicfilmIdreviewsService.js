'use strict';


/**
 * Retrieve the list of all the reviews that have been issued/completed for a public film
 * All the reviews that have been issued/completed for the public film with ID filmId are retrieved. A pagination mechanism is used to limit the size of messages. This operation does not require authentication. 
 *
 * filmId Long ID of the film whose reviews must be retrieved
 * pageNo Integer ID of the requested page (if absent, the first page is returned) (optional)
 * returns Reviews
 **/
exports.getFilmReviews = function(filmId,pageNo) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "next" : "http://example.com/aeiou",
  "films" : [ {
    "reviewerId" : 5,
    "$schema" : "$schema",
    "reviewDate" : "2000-01-23",
    "review" : "review",
    "filmId" : 5,
    "rating" : 3,
    "self" : "http://example.com/aeiou",
    "completed" : false
  }, {
    "reviewerId" : 5,
    "$schema" : "$schema",
    "reviewDate" : "2000-01-23",
    "review" : "review",
    "filmId" : 5,
    "rating" : 3,
    "self" : "http://example.com/aeiou",
    "completed" : false
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


/**
 * Issue film review to some users
 * The film with ID filmId is assigned to one or more users for review and the corresponding reviews are created. The users are specified in the review representations in the request body. This operation can only be performed by the owner. 
 *
 * body List The new film reviews, including the users to whom they are issued
 * filmId Long ID of the film
 * returns List
 **/
exports.issueFilmReview = function(body,filmId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reviewerId" : 5,
  "$schema" : "$schema",
  "reviewDate" : "2000-01-23",
  "review" : "review",
  "filmId" : 5,
  "rating" : 3,
  "self" : "http://example.com/aeiou",
  "completed" : false
}, {
  "reviewerId" : 5,
  "$schema" : "$schema",
  "reviewDate" : "2000-01-23",
  "review" : "review",
  "filmId" : 5,
  "rating" : 3,
  "self" : "http://example.com/aeiou",
  "completed" : false
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

