
/**
 * Constructor function for MqttFilmMessage objects
*/
export function MqttFilmMessage({ status, userId, userName } = {}) {
    this.status = status;
    this.userId = userId
    this.userName = userName;
};

export const MqttStatusMessageEnum = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted'
});