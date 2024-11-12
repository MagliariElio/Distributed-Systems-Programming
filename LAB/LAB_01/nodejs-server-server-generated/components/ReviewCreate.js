const ReviewBase = require('./ReviewBase');

/**
 * Class used when creating a new review for a film, with required reviewerId.
 * 
 * @class
 * @param {number} reviewerId - The ID of the user who received the review invitation.
 */
class ReviewCreate extends ReviewBase {
    constructor(reviewerId, completed = false, reviewDate = null, rating = null, reviewText = '') {
        super(completed, reviewDate, rating, reviewText);
        this.reviewerId = reviewerId;
    }
}

module.exports = ReviewCreate;
