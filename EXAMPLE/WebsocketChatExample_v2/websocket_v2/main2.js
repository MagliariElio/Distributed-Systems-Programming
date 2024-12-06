const connection = new WebSocket('ws://localhost:8090');
const messages = document.querySelector('#messages');

connection.onopen = () => {
  console.log('connected');
};

connection.onclose = () => {
  console.error('disconnected');
};

connection.onerror = error => {
  console.error('error:', error);
};

connection.onmessage = event => {
  console.log('received:', event.data);
  showMessage(event.data);
};

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault();  // prevent that event causes form submission
  let message = document.querySelector('#message').value;
  let name = document.querySelector('#name').value
  connection.send(name+": "+message);
  document.querySelector('#message').value = '';
});

function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight; // scroll down
  }