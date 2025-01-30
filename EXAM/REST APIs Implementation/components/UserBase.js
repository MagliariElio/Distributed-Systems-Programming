

class UserBase {
     /**
     * Creates an instance of the UserBase class.
     * 
     * This constructor initializes the email and name properties for the user.
     * It ensures that the email is provided, throwing an error if not.
     * 
     * @throws {Error} If the email is not provided.
     * @param {string} email - The email address of the user (required).
     * @param {string} [name=''] - The name of the user (optional, defaults to an empty string).
     */
    constructor(email, name = '') {
        if (!email) {
            throw new Error("Email is required");
        }
        
        this.email = email;
        this.name = name;
    }
}

module.exports = UserBase;
