'use strict';

const bcrypt = require('bcrypt');
const dbUtils = require('../utils/DbUtils')

/**
 * Logs a user in
 * The user who wants to log in sends the user data to the authenticator which performs the operation. If the request for the login of a new user comes from an already authenticated user, the previous user is first logged out. 
 *
 * body NewUser The data of the user who wants to perform log in. The data structure must contain email and password.
 * no response value expected for this operation
 **/
exports.authenticateUser = async function (email, password) {
  try {
    const user = await dbUtils.dbGetAsync("SELECT * FROM users WHERE email = ?", [email]);
    
    // If they are equal so the credentials are correct
    if (bcrypt.compareSync(password, user.hash)) {
      return dbUtils.mapObjToUser(user);
    } else {
      return undefined;
    }
  } catch (err) {
    throw new Error(`Error fetching user: ${err.message}`);
  }
}