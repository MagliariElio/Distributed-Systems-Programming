'use strict';

const dbUtils = require('../utils/DbUtils')
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Update the active selection of a public film
 * The public film with ID `filmId` is selected as active by the authenticated user.  This operation can only be performed by an authenticated user who is a reviewer for the film. The active status of the film is updated, but its visibility cannot be changed. 
 *
 * filmId Long ID of the public film to be set as active
 * no response value expected for this operation
 **/
exports.patchFilmActiveSelection = async function (filmId, loggedUserId) {
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
    if(activeInvitations.length > 0) {
      activeInvitations.forEach(async invitation => {
        const sqlUpdateActive = 'UPDATE reviews SET active = 0 WHERE filmId = ? AND reviewerId = ?';
        await dbUtils.dbRunAsync(sqlUpdateActive, [invitation.filmId, loggedUserId]);
      })
    }

    const sqlUpdate = 'UPDATE reviews SET active = 1 WHERE filmId = ? AND reviewerId = ?';
    await dbUtils.dbRunAsync(sqlUpdate, [filmId, loggedUserId]);

    return {};
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error selecting film: ${err.message}`);
    }
  }
}
