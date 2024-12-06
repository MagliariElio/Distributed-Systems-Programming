const messagesArea = document.querySelector('#messages');
const messageField = document.querySelector('#message');
const nameField = document.querySelector('#name');
const reconnectButton = document.querySelector('#connect');
const form = document.querySelector('form');

const TIMEOUT=500;   // the initial timeout in milliseconds (the actual one is doubled at each reconnection attempt)
const MAXRETRIES=5;  // the number of reconnection attemps before entering disconnected mode

// state constants
const CONNECTING=0;
const CONNECTED=1;
const DISCONNECTED=2;

const DISCONNECTED_MODE_ALERT="You are in disconnected mode. Use Re-Connect to retry.";

var connection; // the websocket
var retries=0;  // the number of reconnection attempts made so far
var tout=TIMEOUT;   // the current timeout in milliseconds
var state=CONNECTING; // the current state

// the function that initializes the websocket connection
function connectSocket () {
    resetRetriesAndTimeout();
    state=CONNECTING;
    disableReconnect();
    initSocket();
}

function resetRetriesAndTimeout () {
    retries=0;
    tout=TIMEOUT;
}

function initSocket() {
    connection = new WebSocket('ws://localhost:8090');

    connection.onopen = () => {
        state=CONNECTED;
        resetRetriesAndTimeout();
        console.log('connected');
     };

    connection.onclose = () => {
        state=CONNECTING;
        console.error('disconnected.');
        retries++;
        tout*=2;    // timeout is doubled at each new attempt
        if (retries<=MAXRETRIES) {
            var seconds=tout/1000;
            console.log(`trying to reconnect in ${seconds} seconds`);
            setTimeout(initSocket, tout);
        }
        else {
            console.log('maximum number of reconnect reached');
            disconnectedMode();
        }
    };

    connection.onerror = error => {
        if (state==CONNECTED)
            console.error('fatal error. Closing...', error)
        else if (state=CONNECTING)
            console.error('failed to connect. ', error);
        else // state is DISCONNECTED
            console.error('error while in disconnected mode. ', error);
        connection.close();
    };

    connection.onmessage = event => {
        console.log('received:', event.data);
        showMessage(event.data);
    };
}

function disconnectedMode () {
    state=DISCONNECTED;
    enableReconnect();
    alert(DISCONNECTED_MODE_ALERT);
}

function showMessage(message) {
    messages.textContent += `\n${message}`;
    messages.scrollTop = messages.scrollHeight; // scroll down
}

function enableReconnect() {
    reconnectButton.onclick=connectSocket;
    reconnectButton.disabled=false;
}

function disableReconnect() {
    reconnectButton.disabled=true;
}

form.addEventListener('submit', event => {
    event.preventDefault();  // prevent that event causes form submission
    if (state==CONNECTING) {
        alert("You are not connected. Connection in progress.")
    } else if (state==CONNECTED) {
        let message = messageField.value;
        let name = nameField.value
        connection.send(name+": "+message);
        messageField.value = '';
    } else { // state is DISCONNECTED
        alert(DISCONNECTED_MODE_ALERT);
    }
})
connectSocket();