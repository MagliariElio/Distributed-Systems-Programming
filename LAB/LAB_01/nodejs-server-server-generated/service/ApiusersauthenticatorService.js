'use strict';


/**
 * Logs a user in
 * The user who wants to log in sends the user data to the authenticator which performs the operation. If the request for the login of a new user comes from an already authenticated user, the previous user is first logged out. 
 *
 * body User The data of the user who wants to perform log in. The data structure must contain email and password.
 * no response value expected for this operation
 **/
exports.authenticateUser = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

