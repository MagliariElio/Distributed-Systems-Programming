'use strict';

const dbUtils = require('../utils/DbUtils')

/**
 * Get information about the users
 * The available information (passwords excluded) about all the users is retrieved. 
 * This operation is available only to authenticated users. A pagination mechanism is used to limit the size of users. 
 *
 * returns Users
 **/
exports.getUsers = async function (pageNo) {
  try {
    const usersPerPage = 10;
    const offset = (pageNo - 1) * usersPerPage;

    const sql = `
      SELECT * FROM users 
      LIMIT ? OFFSET ?
    `;
    const users = await dbUtils.dbAllAsync(sql, [usersPerPage, offset]);

    const sqlCount = 'SELECT COUNT(*) AS totalItems FROM users';
    const countResult = await dbUtils.dbGetAsync(sqlCount, []);
    const totalItems = countResult.totalItems;
    const totalPages = Math.ceil(totalItems / usersPerPage);

    var row = {
      totalPages: totalPages,
      currentPage: pageNo,
      totalItems: totalItems,
      users: users.map(row => dbUtils.mapObjToUser(row))
    };
    
    return dbUtils.mapObjToUsers(row);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error fetching public films: ${err.message}`);
    }
  }
}

