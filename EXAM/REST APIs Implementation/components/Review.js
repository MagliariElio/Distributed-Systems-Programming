
const ReviewBase = require('./ReviewBase');

/**
 * Class representing a review for a film, including film and reviewer ID, and links for interaction.
 * 
 * @class
 * @param {number} filmId - The unique ID of the film being reviewed.
 * @param {number} reviewerId - The ID of the user who received the review invitation.
 * @param {string} reviewDate - Date when the review was completed.
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 * @param {string} self - The URI link to the current review.
 * @param {string} update - The URI link to update the review.
 * @param {string} delete - The URI link to delete the review.
 */
class Review extends ReviewBase {
    constructor(filmId, reviewerId, completed = false, reviewDate = null, rating = null, reviewText = null, editReviewRequestParam = null) {
        super(reviewDate, rating, reviewText);
        this.filmId = filmId;
        this.reviewerId = reviewerId;
        this.completed = completed === 1;

        if (this.completed && editReviewRequestParam != null) {
            this.editReviewRequest = editReviewRequestParam;
        }

        this.links = [
            {
                'rel': 'self',
                'method': 'GET',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}`
            },
            !completed && {
                'rel': 'update',
                'method': 'PATCH',
                'href': `/api/films/public/${this.filmId}/reviews`
            },
            !completed && {
                'rel': 'delete',
                'method': 'DELETE',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}`
            },
            completed && editReviewRequestParam !== null && {
                'rel': 'editReviewRequest',
                'method': 'GET',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}/editrequests`
            }
        ].filter(Boolean);
    }
}

module.exports = Review;
