const User = require('./User');

class Users {
    /**
     * Creates an instance of the Users class.
     * 
     * This constructor initializes the `totalPages`, `currentPage`, `totalItems`, 
     * `users`, `next`, and `previous` properties. It also ensures that the `users` 
     * array is provided and contains valid `User` objects.
     * 
     * @throws {Error} If `users` is not an array or is empty.
     * @param {number} totalPages - The total number of pages in the collection.
     * @param {number} currentPage - The current page of users.
     * @param {number} totalItems - The total number of items in the current page.
     * @param {Array<User>} users - An array of `User` objects for the current page.
     */
    constructor(totalPages = 0, currentPage = 0, totalItems, users) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.users = users;

        // HATEOAS links for pagination
        this.links = [
            currentPage < totalPages && {
                'rel': 'next',
                'method': 'GET',
                'href': `/api/users?pageNo=${currentPage + 1}`
            },
            currentPage > 1 && {
                'rel': 'previous',
                'method': 'GET',
                'href': `/api/users?pageNo=${currentPage - 1}`
            }
        ].filter(Boolean);
    }
}

module.exports = Users;
