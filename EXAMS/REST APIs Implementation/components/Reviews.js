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
        this.links = [
            currentPage < totalPages && {
                'rel': 'next',
                'method': 'GET',
                'href': `/api/films/public/${filmId}/reviews?pageNo=${currentPage + 1}`
            },
            currentPage > 1 && {
                'rel': 'previous',
                'method': 'GET',
                'href': `/api/films/public/${filmId}/reviews?pageNo=${currentPage - 1}`
            }
        ].filter(Boolean);
    }
}

module.exports = Reviews;
