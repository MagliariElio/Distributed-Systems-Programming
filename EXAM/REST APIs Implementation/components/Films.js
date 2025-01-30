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
    constructor(totalPages = 0, currentPage = 0, totalItems = 0, films) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.films = films;
        this.totalItems = totalItems;

        // HATEOAS links for pagination
        this.links = [
            currentPage < totalPages && {
                'rel': 'next',
                'method': 'GET',
                'href': `/api/films/private?pageNo=${currentPage + 1}`
            },
            currentPage > 1 && {
                'rel': 'previous',
                'method': 'GET',
                'href': `/api/films/private?pageNo=${currentPage - 1}`
            }
        ].filter(Boolean);
    }
}

module.exports = Films;
