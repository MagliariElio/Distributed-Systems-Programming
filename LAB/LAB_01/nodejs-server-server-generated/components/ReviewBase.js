/**
 * Class representing the base data structure for a review, containing essential details like
 * the film ID, reviewer ID, rating, and review status.
 * 
 * @class
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewBase {
    constructor(rating = null, reviewText = '') {
        this.rating = rating;
        this.reviewText = reviewText;
    }
}

module.exports = ReviewBase;
