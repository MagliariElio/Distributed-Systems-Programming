/**
 * Class representing a paginated collection of reviews for films.
 * 
 * @class
 * @param {number} totalPages - The total number of pages in the collection.
 * @param {number} currentPage - The current page being displayed.
 * @param {number} totalItems - The total number of reviews in the current page.
 * @param {Array} reviews - Array of Review objects for the current page.
 */
class Reviews {
    constructor(totalPages, currentPage, totalItems, reviews, filmId) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.reviews = reviews;

        // HATEOAS links for pagination
        this.next = currentPage < totalPages ? `/api/films/public/${filmId}/reviews?pageNo=${currentPage + 1}` : null,
        this.previous = currentPage > 1 ? `/api/films/public/${filmId}/reviews?pageNo=${currentPage - 1}` : null
    }
}

module.exports = Reviews;
