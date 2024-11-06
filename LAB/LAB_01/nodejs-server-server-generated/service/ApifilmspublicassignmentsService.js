'use strict';


/**
 * Assign automatically review invitations for the unassigned public films owned by the authenticated user in a balanced manner
 * The films owned by the authenticated user who performed the request and that are not assigned to any user for review, are automatically assigned to the users of the service in a balanced manner. The assignments are returned. Only authenticated users can make this request. 
 *
 * returns List
 **/
exports.assignReviewBalanced = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reviewerId" : 6,
  "filmId" : 0
}, {
  "reviewerId" : 6,
  "filmId" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

