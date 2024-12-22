
class MqttFilmMessage {
    /**
     * Creates an instance of the MqttFilmMessage class.
     * 
     * @param {string} status - Current condition of the film (the available types are active if it is selected by a user, inactive if it is not selected by any user, or deleted if it has been removed from the service.
     * @param {integer} userId - Identifier of the user.
     * @param {string} userName - Name of the user.
     */
    constructor(status, userId, userName) {
        this.status = status;
        this.userId = userId;
        this.userName = userName;
    }
}

module.exports = MqttFilmMessage;
