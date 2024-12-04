/**
 * Creates an instance of the Films object, representing a paginated collection of films.
 * 
 * @param {number} totalPages - The total number of pages available.
 * @param {number} currentPage - The current page number.
 * @param {number} totalItems - The total number of films on the current page.
 * @param {Array<Film>} films - Array of Film objects for the current page.
 */
export function Films({ totalPages = 0, currentPage = 0, totalItems, films = [], next, previous }) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.films = films;

    if (next) {
        this.next = next;
    }

    if (previous) {
        this.previous = previous;
    }
};