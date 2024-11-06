'use strict';


/**
 * Delete a review invitation
 * The review of the film with ID filmId and issued to the user with ID reviewerId is deleted. This operation can only be performed by the owner, and only if the review has not yet been completed by the reviewer. 
 *
 * filmId Long ID of the film whose review invitation must be deleted
 * reviewerId Long ID of the user to whom the review has been issued
 * no response value expected for this operation
 **/
exports.deleteSingleReview = function(filmId,reviewerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Retrieve a review that has been issued/completed for a film
 * The review of the film with ID filmID issued to the user with ID reviewerId is retrieved. This operation does not require authentication. 
 *
 * filmId Long ID of the film whose reviews must be retrieved
 * reviewerId Long ID of the user to whom the review has been issued
 * returns Review
 **/
exports.getSingleReview = function(filmId,reviewerId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "reviewerId" : 5,
  "$schema" : "$schema",
  "reviewDate" : "2000-01-23",
  "review" : "review",
  "filmId" : 5,
  "rating" : 3,
  "self" : "http://example.com/aeiou",
  "completed" : false
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Complete a review
 * The review of the film with ID filmId and issued to the user with ID reviewerId is completed. This operation only allows setting the \"completed\" property to the \"true\" value, and changing the values of the \"reviewDate\", \"rating\", and \"review\" properties. This operation can be performed only by the invited reviewer. 
 *
 * body Review The updated Review object
 * filmId Long ID of the film whose review must be completed
 * reviewerId Long ID of the user to whom the review has been issued
 * no response value expected for this operation
 **/
exports.updateSingleReview = function(body,filmId,reviewerId) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

