const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8090 });

webSocketServer.on('listening', () => {
  console.log('Websocket server listening');
});

webSocketServer.on('connection', webSocket => {
  new service(webSocket);
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

function service(socket) {
  var name = 'anonymous';
  const regex = RegExp('[a-zA-Z]+:[a-zA-Z.!?+-]*');
  socket.on('message', message => {
    console.log('Received:', message);
    if (!regex.test(message))
      socket.send('Wrong message. Undelivered (make sure you specified your name and your message contains only valid characters)')
    else {
      let tokenized = message.split(':');
      name = tokenized[0];
      broadcast(message);
    }
  });
  socket.on('close', function () {
    console.log(`${name} Closed`);
    broadcast(`${name}: abandoned the chat`);
  });
  socket.on('error', function () {
    console.log(`${name} Reset`);
    socket.close();
  });
  setInterval(function () { socket.ping()}, 5000);
}