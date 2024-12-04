/**
 * Function used for creating an object to update an existing review.
 * Combines all necessary fields for a review, including rating, reviewText, reviewDate, and completed.
 * 
 * @param {string} reviewDate - Date when the review was completed.
 * @param {number} rating - Rating given by the reviewer (1-10).
 * @param {string} reviewText - Text content of the review.
 * @returns {Object} - The review object ready for update.
 */
export function ReviewUpdate({ reviewDate = null, rating = null, reviewText = '' } = {}) {
    this.reviewDate = reviewDate
    this.rating = rating
    this.reviewText = reviewText
};