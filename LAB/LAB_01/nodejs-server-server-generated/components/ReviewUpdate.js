const ReviewBase = require('./ReviewBase');

/**
 * Class used for updating an existing review, inheriting from the base Review structure.
 * 
 * @class
 * @param {boolean} completed - Indicates if the review is completed.
 * @param {string} reviewDate - Date when the review was completed.
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewUpdate extends ReviewBase {
    constructor(completed = false, reviewDate = null, rating = null, reviewText = '') {
        super(completed, reviewDate, rating, reviewText);
    }
}

module.exports = ReviewUpdate;
