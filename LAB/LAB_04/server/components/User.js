const UserBase = require('./UserBase');

class User extends UserBase {
    /**
     * Creates an instance of the User class.
     * 
     * This constructor initializes the `id`, `email`, `name`, and `self` properties
     * for the user, and generates the `self` link based on the user's ID.
     * 
     * @throws {Error} If the `id` is not provided.
     * @param {number} id - The unique identifier for the user.
     * @param {string} email - The email address of the user (required).
     * @param {string} [name=''] - The name of the user (optional).
     */
    constructor(id, email, name = '') {
        super(email, name);

        if (!id) {
            throw new Error("User ID is required");
        }

        this.id = id;

        this.self = `/api/users/${this.id}`;
    }
}

module.exports = User;
