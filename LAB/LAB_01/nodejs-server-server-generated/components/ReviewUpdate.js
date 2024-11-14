const ReviewBase = require('./ReviewBase');

/**
 * Class used for updating an existing review, inheriting from the base Review structure.
 * 
 * @class
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 */
class ReviewUpdate extends ReviewBase {
    constructor(rating = null, reviewText = '') {
        super(rating, reviewText);
    }
}

module.exports = ReviewUpdate;
