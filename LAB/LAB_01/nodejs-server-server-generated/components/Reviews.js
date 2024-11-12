/**
 * Class representing a paginated collection of reviews for films.
 * 
 * @class
 * @param {number} totalPages - The total number of pages in the collection.
 * @param {number} currentPage - The current page being displayed.
 * @param {number} totalItems - The total number of reviews in the current page.
 * @param {Array} reviews - Array of Review objects for the current page.
 * @param {string} next - Link to the next page of reviews (if available).
 * @param {string} previous - Link to the previous page of reviews (if available).
 */
class Reviews {
    constructor(totalPages, currentPage, totalItems, reviews, next = null, previous = null) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.reviews = reviews;
        this.next = next;
        this.previous = previous;
    }
}

module.exports = Reviews;
