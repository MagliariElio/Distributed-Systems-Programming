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
    const user = await dbUtils.dbGetAsync("SELECT * FROM users WHERE id = ?", [userId]);

    // If no user is found, return undefined
    if (!user) {
      return undefined;
    }

    return user;
  } catch (err) {
    throw new Error(`Error fetching user: ${err.message}`);
  }
}