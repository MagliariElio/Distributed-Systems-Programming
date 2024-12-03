const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8090 });

webSocketServer.on('listening', () => {
  console.log('Websocket server listening');
});

webSocketServer.on('connection', webSocket => {
  console.log('Connection established');
  webSocket.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });
  webSocket.on('close', () => {
    console.log('Connection closed');
  });
  webSocket.on('error', error => {
    console.log('Connection error:', error);
  });
});

webSocketServer.on('close', () => {
  console.error('Websocket server closed');
});

webSocketServer.on('error', error => {
  console.error('Websocket error:',error);
});

// send data to all clients having an open connection
function broadcast(data) {
  webSocketServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}