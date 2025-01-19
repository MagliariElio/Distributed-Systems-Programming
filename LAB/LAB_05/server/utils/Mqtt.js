
const mqtt = require('mqtt');
const { getFilmsSelection } = require('../service/ApifilmspublicfilmIdselectionService');
const MqttFilmMessage = require('../components/MqttFilmMessage');

const brokerUrl = 'ws://127.0.0.1:8080';
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
const options = {
    keepalive: 30,
    clientId: clientId,
    clean: true,
    reconnectPeriod: 60000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed Abnormally...',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
};

const client = mqtt.connect(brokerUrl, options);


client.on('connect', async () => {
    console.info(clientId + ' connected to the MQTT broker');

    try {
        const films = await getFilmsSelection();
        for (const film of films) {
            const status = (film.userId) ? this.MqttStatusMessageEnum.ACTIVE : this.MqttStatusMessageEnum.INACTIVE;
            const message = new MqttFilmMessage(status, film.userId, film.userName);
            this.publishFilmMessageMqtt(film.filmId, message);
        }
    } catch (e) {
        console.error('MQTT Error on connect: ', e);
        client.end();
    }
});

client.on('close', () => {
    console.info(clientId + ' disconnected by the MQTT broker');
});

client.on('error', (e) => {
    console.error('MQTT Error: ', e);
    client.end();
});

module.exports.publishFilmMessageMqtt = function publishFilmMessageMqtt(filmId, message) {
    console.log(String(filmId), JSON.stringify(message));

    client.publish(String(filmId), JSON.stringify(message), { qos: 0, retain: true });
}

module.exports.MqttStatusMessageEnum = Object.freeze({
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DELETED: 'deleted'
});
