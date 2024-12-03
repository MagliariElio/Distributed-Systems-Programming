'use strict';

const dbUtils = require('../utils/DbUtils')
const ApifilmspublicfilmIdreviews = require('../service/ApifilmspublicfilmIdreviewsService');

/*
- Step 1: Fetch Films with No Pending Invitations
  - The algorithm retrieves all films that the logged-in user owns, are not private, and have no pending review invitations. This is done by checking films that haven't been assigned for review yet.

- Step 2: Check for No Films
  - If no films meet the criteria (i.e., there are no films to assign reviews to), the function exits early and returns an empty array.

- Step 3: Count Pending Invitations for Each Reviewer
  - The algorithm queries the database to count how many pending review invitations each reviewer has. It calculates this by counting reviews marked as incomplete (not finished) for each user.

- Step 4: Find the Maximum Pending Invitations
  - The function determines the maximum number of pending invitations any reviewer has. This helps in balancing the review load among all reviewers.

- Step 5: Adjust Maximum Invitations if Needed
  - If all users have the same number of pending invitations, the `maxInvitationCount` is incremented by 1. This adjustment ensures that no user is unfairly overloaded with reviews if all are equally "busy."

- Step 6: Retrieve Reviewers Assigned to Each Film
  - The algorithm fetches the list of reviewers already assigned to the films that need to be reviewed. This is done by grouping the `reviewerId`s for each film, allowing the function to check which reviewers are already assigned to which films.

- Step 7: Assign Films to Reviewers
  - For each user with pending invitations, the algorithm assigns a balanced number of films based on how many reviews they still need. It ensures no user is assigned too many films by comparing the `assignedNumbers` and the `maxInvitations`. It avoids assigning films to a reviewer who is already assigned to that film.

- Step 8: Prepare Final Result
  - The algorithm constructs a result object for each film, which includes the film ID and the list of reviewers assigned to it. This is built by checking which users were assigned the current film.

- Step 9: Issue Review Invitations
  - Once the assignments are finalized, the algorithm sends review invitations for each film to the corresponding reviewers.

- Step 10: Handle Errors
  - If any error occurs during the execution of the function, the algorithm catches the error and rethrows it with an appropriate message.
*/

/**
 * Assign automatically review invitations for the unassigned public films owned by the authenticated user in a balanced manner
 * The films owned by the authenticated user who performed the request and that are not assigned to any user for review, are automatically assigned to the users of the service in a balanced manner. The assignments are returned. Only authenticated users can make this request. 
 *
 * returns List
 **/
exports.assignReviewBalanced = async function (loggedUserId) {
  try {
    // Get all films that have no pending review invitations
    const sqlFilmsNoInvitation = `
      SELECT id
      FROM films
      WHERE private = 0 AND owner = ?
        AND id NOT IN (
          SELECT DISTINCT(filmId)
          FROM reviews AS r INNER JOIN films AS f ON r.filmId = f.id
          WHERE r.completed = 0 AND f.owner = ?
      )
    `;
    // Fetch the films without any pending review invitations
    var filmsWithNoInvitation = await dbUtils.dbAllAsync(sqlFilmsNoInvitation, [loggedUserId, loggedUserId]);
    filmsWithNoInvitation = filmsWithNoInvitation.map(film => film.id);

    // If there are no films to assign, return an empty array
    if (filmsWithNoInvitation.length == 0) {
      return []
    }

    // Count the number of pending review invitations for each reviewer
    const sqlUserWithPendingInvitation = `
      SELECT u.id AS reviewerId, 
       COALESCE(COUNT(r.reviewerId), 0) AS numberPendingInvitations
      FROM users u
      LEFT JOIN reviews r ON u.id = r.reviewerId AND r.completed = 0
      GROUP BY u.id
      ORDER BY numberPendingInvitations ASC
    `;
    var usersWithPendingInvitations = await dbUtils.dbAllAsync(sqlUserWithPendingInvitation, []);

    // Find the maximum number of pending invitations for any user
    var maxInvitationCount = usersWithPendingInvitations.reduce((max, reviewer) => {
      return reviewer.numberPendingInvitations > max ? reviewer.numberPendingInvitations : max;
    }, 0);

    // If there are no users with pending invitations, return an empty array
    if (usersWithPendingInvitations.length == 0) {
      return [];
    }

    // If all users have the same number of pending invitations, increment the max count by 1
    if (usersWithPendingInvitations.every((user) => user.numberPendingInvitations == maxInvitationCount)) {
      maxInvitationCount += 1;
    }

    // Get the list of reviewers assigned to each film
    const sqlGroupReviewerPerFilm = `
      SELECT filmId, GROUP_CONCAT(reviewerId) AS reviewerIds
      FROM reviews
      WHERE filmId IN (${filmsWithNoInvitation.map(() => '?').join(', ')})
      GROUP BY filmId
    `;
    var usersWithFilmIdsReviewed = await dbUtils.dbAllAsync(sqlGroupReviewerPerFilm, filmsWithNoInvitation);
    usersWithFilmIdsReviewed.forEach((film) => film.reviewerIds = film.reviewerIds.split(',').map(Number));

    // Calculate the maximum number of reviews a user can be assigned, ensuring the distribution is balanced
    const maxInvitations = Math.max(filmsWithNoInvitation.length, maxInvitationCount);

    // Assign films to users based on their pending invitations
    for (const user of usersWithPendingInvitations) {
      if (filmsWithNoInvitation.length + user.numberPendingInvitations < maxInvitations) {
        user.assignedNumbers = filmsWithNoInvitation.length;
      } else {
        // Otherwise, assign enough films to make the number of pending invitations balanced
        user.assignedNumbers = Math.abs(maxInvitations - user.numberPendingInvitations);
      }

      user.assignedFilms = [];

      // Assign the films to the user, ensuring they are not already assigned
      filmsWithNoInvitation.forEach(filmId => {
        if (user.assignedNumbers <= user.assignedFilms.length) {
          return;
        }
        const film = usersWithFilmIdsReviewed.find(film => film.filmId === filmId);
        if (!film.reviewerIds.includes(user.reviewerId)) {
          user.assignedFilms.push(filmId)
        }
      });
    }

    // Prepare the final result and assign reviews to the films
    var result = [];
    for (const filmId of filmsWithNoInvitation) {
      const res = { filmId: filmId, reviewerIds: [] };

      // Find which users are assigned to the current film
      usersWithPendingInvitations.forEach(user => {
        if (user.assignedFilms.includes(filmId)) {
          res.reviewerIds.push(user.reviewerId);
        }
      })
      result.push(res);

      // Issue the review invitations for the film
      const list = res.reviewerIds;
      await ApifilmspublicfilmIdreviews.issueFilmReview(list, filmId, loggedUserId);
    }

    return result;
  } catch (err) {
    if (err.status) {
      throw err;
    } else {
      throw new Error(`Error balancing review invitations: ${err.message}`);
    }
  }
}

