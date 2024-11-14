'use strict';

const dbUtils = require('../utils/db-utils')

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
      const error = new Error(`Invalid user ID.`);
      error.status = 400;
      throw error;
    }

    const user = await dbUtils.dbGetAsync("SELECT * FROM users WHERE id = ?", [userId]);

    // If no user is found, return undefined
    if (!user) {
      const error = new Error(`User with ID ${userId} not found.`);
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