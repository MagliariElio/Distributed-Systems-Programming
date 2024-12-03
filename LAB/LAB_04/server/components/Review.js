
const ReviewBase = require('./ReviewBase');

/**
 * Class representing a review for a film, including film and reviewer ID, and links for interaction.
 * 
 * @class
 * @param {number} filmId - The unique ID of the film being reviewed.
 * @param {number} reviewerId - The ID of the user who received the review invitation.
 * @param {string} self - The URI link to the current review.
 * @param {string} update - The URI link to update the review.
 * @param {string} delete - The URI link to delete the review.
 */
class Review extends ReviewBase {
    constructor(filmId, reviewerId, completed = false, reviewDate = null, rating = null, reviewText = null, active = false) {
        super(reviewDate, rating, reviewText);
        this.filmId = filmId;
        this.reviewerId = reviewerId;
        this.completed = completed;
        this.active = active;

        this.self = `/api/films/public/${this.filmId}/reviews/${this.reviewerId}`;
        if (!completed) {
            this.update = `/api/films/public/${this.filmId}/reviews`;
            this.delete = `/api/films/public/${this.filmId}/reviews/${this.reviewerId}`;
        }
    }
}

module.exports = Review;
