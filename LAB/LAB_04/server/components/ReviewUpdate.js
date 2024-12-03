const ReviewBase = require('./ReviewBase');

/**
 * Class used for updating an existing review.
 * 
 * @class
 * @param {string} reviewDate - Date when the review was completed.
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewUpdate extends ReviewBase {
    constructor(reviewDate = null, rating = null, reviewText = '') {
        super(reviewDate, rating, reviewText)
    }
}

module.exports = ReviewUpdate;
