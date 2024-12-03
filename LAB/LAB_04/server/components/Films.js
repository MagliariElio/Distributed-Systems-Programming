const Film = require('./Film');

class Films {
    /**
     * Creates an instance of the Films class, representing a paginated collection of films.
     * 
     * @param {number} totalPages - The total number of pages available.
     * @param {number} currentPage - The current page number.
     * @param {number} totalItems - The total number of films on the current page.
     * @param {Array<Film>} films - Array of Film objects for the current page.
     */
    constructor(totalPages, currentPage, totalItems, films) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.films = films;
        this.totalItems = totalItems;

        // HATEOAS links for pagination
        this.next = currentPage < totalPages ? `/api/films/private?pageNo=${currentPage + 1}` : null,
        this.previous = currentPage > 1 ? `/api/films/private?pageNo=${currentPage - 1}` : null
    }
}

module.exports = Films;
