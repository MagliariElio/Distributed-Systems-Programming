/**
 * Class representing the base data structure for a review, containing essential details like
 * the film ID, reviewer ID, rating, and review status.
 * 
 * @class
 * @param {boolean} completed - Indicates if the review is completed.
 * @param {string} reviewDate - Date when the review was completed.
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewBase {
    constructor(reviewDate = null, rating = null, reviewText = '') {
        this.reviewDate = reviewDate;
        this.rating = rating;
        this.reviewText = reviewText;
    }
}

module.exports = ReviewBase;
