const Film = require('./Film');

class Films {
    /**
     * Creates an instance of the Films class, representing a paginated collection of films.
     * 
     * @param {number} totalPages - The total number of pages available.
     * @param {number} currentPage - The current page number.
     * @param {number} totalItems - The total number of films on the current page.
     * @param {Array<Film>} films - Array of Film objects for the current page.
     * @param {string} next - Link to the next page (if available).
     * @param {string} previous - Link to the previous page (if available).
     */
    constructor(totalPages, currentPage, totalItems, films, next = null, previous = null) {
        if (!Array.isArray(films) || films.length === 0) {
            throw new Error("Films must be a non-empty array.");
        }

        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.films = films;
        this.totalItems = totalItems;

        // HATEOAS links for pagination
        this.next = next;
        this.previous = previous;
    }
}

module.exports = Films;
