const WebSocket = require("ws");
const WSMessage = require("../components/WSMessage");

const webSocketServer = new WebSocket.Server({ port: 5000 });
let loginMessagesMap = new Map();       // Keep trace message of each logged user
let userLoginTimes = new Map();         // Keep trace of timeout sessione for each logged user
const LOGIN_TIMEOUT = 5 * 60 * 1000;    // 5 minutes of timeout
// const LOGIN_TIMEOUT = 1 * 15 * 1000;    // timeout testing of 15 seconds

module.exports.TypeMessageEnum = Object.freeze({
    LOGIN: 'login',
    LOGOUT: 'logout',
    UPDATE: 'update'
});

// Configuring WebSocket
webSocketServer.on('connection', (ws) => {
    console.log('A new WebSocket connection established');

    loginMessagesMap.forEach(function each(message) {
        ws.send(JSON.stringify(message));
    });

    ws.on('close', () => {
        // Se la connessione viene chiusa sarebbe un logout
        console.info("WebSocket connection closed");

        // TODO: da chiedere al professore come memorizzo l'associazione ws, userId dopo aver fatto il login, se serve
    });
});

module.exports.sendAllClients = function sendAllClients(message) {
    webSocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

module.exports.saveMessage = function saveMessage(userId, message) {
    loginMessagesMap.set(parseInt(userId), message);

    console.info(loginMessagesMap);

    if (message.typeMessage == 'login') {
        const currentTime = Date.now();
        userLoginTimes.set(parseInt(userId), currentTime);

        setTimeout(() => {
            if (userLoginTimes.has(parseInt(userId))) {
                console.info(`User ${userId} has timed out after 5 minutes.`);

                const messageLogout = new WSMessage(this.TypeMessageEnum.LOGOUT, userId, undefined, undefined, undefined);
                this.sendAllClients(messageLogout);
                this.deleteMessage(userId);
            }
        }, LOGIN_TIMEOUT);

    }
};

module.exports.userIsLoggedInMessage = function userIsLoggedInMessage(userId) {
    return loginMessagesMap.get(parseInt(userId));
};

module.exports.deleteMessage = function deleteMessage(userId) {
    loginMessagesMap.delete(parseInt(userId));
    userLoginTimes.delete(parseInt(userId));
};