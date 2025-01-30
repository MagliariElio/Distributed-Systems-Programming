
const ErrorsPage = require('../utils/ErrorsPage')

/**
 * Class that represents an error response structure returned by the API.
 * 
 * This class encapsulates the error code, error message, and the schema path used for validation.
 * It is used to structure error responses from the API in a consistent manner.
 *
 * @class
 */
class ErrorResponse {
    /**
     * Creates an instance of the ErrorResponse class.
     * 
     * @param {integer} code - The error code (e.g., 400 for bad request, 404 for not found, etc.)
     * @param {string} message - A brief description of the error.
     * @param {string} schema - (Optional) Path to the JSON schema used for validating the error structure.
     */
    constructor(code, message) {
        if (!code || !message) {
            throw new Error(ErrorsPage.ERROR_CODE_AND_MESSAGE_REQUIRED);
        }

        this.code = code;
        this.message = message;
    }
}

module.exports = ErrorResponse;
