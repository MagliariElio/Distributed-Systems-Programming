
/**
 * Creates an instance of the Users class.
 * 
 * This constructor initializes the `totalPages`, `currentPage`, `totalItems`, 
 * `users`, `next`, and `previous` properties. It also ensures that the `users` 
 * array is provided and contains valid `User` objects.
 */
export function Users({ totalPages = 0, currentPage = 0, totalItems, users = [], next, previous }) {
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalItems = totalItems;
    this.users = users;

    if (next) {
        this.next = next;
    }

    if (previous) {
        this.previous = previous;
    }
};
