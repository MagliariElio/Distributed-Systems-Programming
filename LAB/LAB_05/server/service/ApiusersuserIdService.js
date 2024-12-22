'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Get information about a user
 * The available information (password excluded) about the user specified by userId is retrieved. This operation requires authentication. 
 *
 * userId Long ID of the user to get
 * returns User
 **/
exports.getSingleUser = async function (userId) {
  try {
    if (!userId || isNaN(userId)) {
      const error = new Error(ErrorsPage.ERROR_INVALID_USER_ID);
      error.status = 400;
      throw error;
    }

    const user = await dbUtils.dbGetAsync("SELECT * FROM users WHERE id = ?", [userId]);

    // If no user is found, return undefined
    if (!user) {
      const error = new Error(ErrorsPage.formatErrorUserNotFound(userId));
      error.status = 404;
      throw error;
    }

    return dbUtils.mapObjToUser(user);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching user: ${err.message}`);
    }
  }
}