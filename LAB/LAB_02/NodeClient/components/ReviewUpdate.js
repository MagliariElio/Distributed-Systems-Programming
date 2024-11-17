const ReviewBase = require('./ReviewBase');

/**
 * Class used for updating an existing review.
 * 
 * @class
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewUpdate extends ReviewBase {
    constructor(rating = null, reviewText = '') {
        this.rating = rating;
        this.reviewText = reviewText;
    }
}

module.exports = ReviewUpdate;
