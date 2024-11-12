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
     * @param {string} [next=null] - Link to the next page of users (optional).
     * @param {string} [previous=null] - Link to the previous page of users (optional).
     */
    constructor(totalPages=0, currentPage=0, totalItems, users, next = null, previous = null) {
        if (!Array.isArray(users) || users.length === 0) {
            throw new Error("Users must be a non-empty array.");
        }

        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.users = users;
        this.next = next;
        this.previous = previous;
    }
}

module.exports = Users;
