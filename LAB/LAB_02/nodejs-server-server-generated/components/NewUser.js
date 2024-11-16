const UserBase = require('./UserBase');

class NewUser extends UserBase {
    /**
     * Creates a new instance of NewUser, extending UserBase and adding the password property.
     * Ensures that the password is between 6 and 20 characters long.
     * 
     * @param {string} email - The user's email (required).
     * @param {string} password - The user's password (required, between 6 and 20 characters).
     * @param {string} [name] - The user's name (optional).
     */
    constructor(email, password, name = '') {
        super(email, name);

        if (!password || password.length < 6 || password.length > 20) {
            throw new Error("Password must be between 6 and 20 characters.");
        }

        this.password = password;
    }
}

module.exports = NewUser;
