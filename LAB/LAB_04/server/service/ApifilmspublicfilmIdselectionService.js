'use strict';

const dbUtils = require('../utils/DbUtils');
const ErrorsPage = require('../utils/ErrorsPage');
const WebSocket = require('../utils/WebSocket');
const WSMessage = require('../components/WSMessage');

/**
 * Update the active selection of a public film
 * The public film with ID `filmId` is selected as active by the authenticated user.  This operation can only be performed by an authenticated user who is a reviewer for the film. The active status of the film is updated, but its visibility cannot be changed. 
 *
 * filmId Long ID of the public film to be set as active
 * no response value expected for this operation
 **/
exports.patchFilmActiveSelection = async function (filmId, loggedUserId, usernameLoggedUser) {
  try {
    const sqlAll = 'SELECT filmId, active FROM reviews WHERE reviewerId = ? AND active = 1 AND completed = 0';
    const activeInvitations = await dbUtils.dbAllAsync(sqlAll, [loggedUserId]);

    if (activeInvitations.some(invitation => invitation.active && invitation.filmId === filmId)) {
      const error = new Error(ErrorsPage.ERROR_FILM_ALREADY_SELECTED);
      error.status = 409;
      throw error;
    }

    const sqlSelect = 'SELECT * FROM reviews WHERE filmId = ? AND reviewerId = ?';
    var invitation = await dbUtils.dbGetAsync(sqlSelect, [filmId, loggedUserId]);

    if (!invitation) {
      const error = new Error(ErrorsPage.formatErrorNoReviewInvitation(loggedUserId, filmId));
      error.status = 404;
      throw error;
    }

    if (invitation.completed) {
      const error = new Error(ErrorsPage.formatErrorReviewAlreadyCompletedByReviewer(filmId, loggedUserId));
      error.status = 409;
      throw error;
    }

    // If there is already a film selected
    if (activeInvitations.length > 0) {
      activeInvitations.forEach(async invitation => {
        const sqlUpdateActive = 'UPDATE reviews SET active = 0 WHERE filmId = ? AND reviewerId = ?';
        await dbUtils.dbRunAsync(sqlUpdateActive, [invitation.filmId, loggedUserId]);
      })
    }

    const sqlUpdate = 'UPDATE reviews SET active = 1 WHERE filmId = ? AND reviewerId = ?';
    await dbUtils.dbRunAsync(sqlUpdate, [filmId, loggedUserId]);

    // Getting information about the film
    const sqlMessage = 'SELECT * FROM films WHERE id = ?';
    const row = await dbUtils.dbGetAsync(sqlMessage, [filmId]);
    const film = dbUtils.mapObjToFilm(row);

    // Send message to all logged clients
    const message = new WSMessage(WebSocket.TypeMessageEnum.UPDATE, loggedUserId, usernameLoggedUser, filmId, film.title);
    WebSocket.saveMessage(loggedUserId, message);
    WebSocket.sendAllClients(message);

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error selecting film: ${err.message}`);
    }
  }
}

/**
 * Fetch the active film selected by a reviewer
 * This operation retrieves the active public film selected by the authenticated reviewer, based on the user's ID. 
 * The film is selected as active only if the user is a valid reviewer for that film. 
 * The film's active status cannot be changed through this operation, but its visibility is not modified. 
 * 
 * filmId Long ID of the public film that is currently active for the reviewer
 * Returns the film details if the user is a valid reviewer; otherwise, an error is thrown.
 */
exports.getActiveFilmForReviewer = async function (loggedUserId) {
  try {
    const sqlSelect = 'SELECT * FROM films WHERE id IN (SELECT filmId FROM reviews WHERE reviewerId = ? AND active = 1 AND completed = 0)';
    const row = await dbUtils.dbGetAsync(sqlSelect, [loggedUserId]);
    return dbUtils.mapObjToFilm(row);
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error getting selected film: ${err.message}`);
    }
  }
}
