/**
 * Creates an instance of the Reviews object, representing a paginated collection of reviews for films.
 * 
 * @param {number} totalPages - The total number of pages in the collection.
 * @param {number} currentPage - The current page being displayed.
 * @param {number} totalItems - The total number of reviews in the current page.
 * @param {Array} reviews - Array of Review objects for the current page.
 * @param {number} filmId - The ID of the film being reviewed.
 */
function Reviews({ totalPages = 0, currentPage = 0, totalItems, reviews = [], next, previous }) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.reviews = reviews;

    if (next) {
        this.next = next;
    }

    if (previous) {
        this.previous = previous;
    }
}

export default Reviews;
