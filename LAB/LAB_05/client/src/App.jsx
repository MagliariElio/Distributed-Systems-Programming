import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Toast } from 'react-bootstrap/';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PrivateLayout, PublicLayout, PublicToReviewLayout, ReviewLayout, AddPrivateLayout, EditPrivateLayout, AddPublicLayout, EditPublicLayout, EditReviewLayout, IssueLayout, DefaultLayout, NotFoundLayout, LoginLayout, LoadingLayout, OnlineLayout, LoginRequired } from './components/PageLayout';
import { Navigation } from './components/Navigation';

import MessageContext from './messageCtx';
import API from './API';
import mqtt from 'mqtt';
import { mapObjToMqttFilmMessage } from './utils/Factory';
import { MqttStatusMessageEnum } from './models/MqttFilmMessage';

const webSocketUrl = 'ws://localhost:5000'

// MQTT Connection
const mqttBrokerUrl = 'ws://localhost:8080';
const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
const options = {
  keepalive: 30,
  clientId: clientId,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  will: {
    topic: 'WillMsg',
    payload: 'Connection Closed Abnormally...',
    qos: 0,
    retail: false
  },
  rejectUnauthorized: false
};

const mqttClient = mqtt.connect(mqttBrokerUrl, options);


// Timeout management for logout
var logoutTimeoutID;
const TIMEOUT = 300000; // 5 minutes

function App() {

  const [message, setMessage] = useState('');
  // If an error occurs, the error message will be shown in a toast.
  const handleErrors = (err) => {
    console.error(err)

    let msg = '';

    if (err?.errObj?.name === 'JsonSchemaValidationError') {
      msg = "Error Sending Data to Server";
    }
    else if (err.code === 401 && err?.errObj === "Must be authenticated to make this request!") {
      msg = err?.errObj;
    }
    else if (err?.errObj) {
      msg = err?.errObj;
    }
    else if (typeof (err) === "string") {
      msg = String(err);
    }
    else if (err.error) {
      msg = err.error;
    }
    else if (err.message) {
      msg = err.message;
    }
    else {
      msg = "Error";
    }

    setMessage(msg); // WARN: a more complex application requires a queue of messages. In this example only last error is shown.
  }

  return (
    <BrowserRouter>
      <MessageContext.Provider value={{ handleErrors }}>
        <Container fluid className="App">
          <Toast
            bg='danger'
            show={message !== ''}
            onClose={() => setMessage('')}
            delay={4000}
            autohide
          >
            <Toast.Body style={{ color: 'white', fontSize: '20px' }}>{message}</Toast.Body>
          </Toast>
          <Routes>
            <Route path="/*" element={<Main />} />
          </Routes>
        </Container>
      </MessageContext.Provider>
    </BrowserRouter>
  )
}

function Main() {
  // This state is used for displaying a LoadingLayout while we are waiting an answer from the server.
  const [loading, setLoading] = useState(true);
  // This state keeps track if the user is currently logged-in.
  const [loggedIn, setLoggedIn] = useState(false);
  // This state contains the user's info.
  const [user, setUser] = useState(null);
  // This state contains the possible selectable filters.
  const [filters, setFilters] = useState({});
  //This state contains the online list.
  const [onlineList, setOnlineList] = useState([]);
  //This state contains the Film Manager resource.
  const [filmManager, setFilmManager] = useState({});

  const [subscribedTopics, setSubscribedTopics] = useState([]);
  const [filmSelections, setFilmSelections] = useState([]);

  // Error messages are managed at context level (like global variables)
  const { handleErrors } = useContext(MessageContext);

  const location = useLocation();

  let socket = useRef(null);

  //Film manager resource retrieval
  useEffect(() => {
    const init = async () => {
      const fm = await API.getFilmManager()
      setFilmManager(fm);
      sessionStorage.setItem('filmManager', JSON.stringify(fm));
    }

    init();
  }, []);

  //WebSocket management
  useEffect(() => {
    const ws = new WebSocket(webSocketUrl);

    ws.onopen = () => {
      console.info("WebSocket Connection Established!");
      ws.send('Message From Client');
    }

    ws.onerror = (error) => {
      console.error(`WebSocket error: ${error}`);
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.info(message);

        // Gestisci i vari tipi di messaggi dal server
        if (message.typeMessage === 'login') {
          delete message.typeMessage;

          setOnlineList(prevUsers => {
            const userExists = prevUsers.find(user => user.userId === message.userId);

            if (!userExists) {
              return [...prevUsers, message];
            }

            return prevUsers;
          });
        } else if (message.typeMessage === 'logout') {
          // If the userId is equal to the logged user id then logout
          if (sessionStorage.getItem('userId') == message.userId) {
            handleLogout()
          }

          // Update the online list user
          setOnlineList(prevUsers => prevUsers.filter(user => user.userId !== message.userId));
        } else if (message.typeMessage === 'update') {
          delete message.typeMessage;
          setOnlineList(prevUsers =>
            prevUsers.map(user => user.userId === message.userId ? { ...message } : user)
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    socket.current = ws;
  }, []);

  useEffect(() => {
    mqttClient.on('connect', () => {
      console.info(clientId + ' connected to the MQTT broker');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        var parsedMessage = JSON.parse(message);
        
        console.log('Received message from topic: ', topic, ' with message: ', parsedMessage);
        const mqttMessage = mapObjToMqttFilmMessage(parsedMessage);

        if (mqttMessage.status == MqttStatusMessageEnum.DELETED) {
          mqttClient.unsubscribe(topic);
        }

        displayFilmSelection(topic, mqttMessage);
      } catch (e) {
        console.error('MQTT Error on connect: ', e);
        mqttClient.end();
      }
    });

    mqttClient.on('error', (e) => {
      console.error('MQTT Error on connect: ', e);
      mqttClient.end();
    });

    mqttClient.on('close', () => {
      console.info(clientId + ' disconnected by the MQTT broker');
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // Define filters 
      const filters = ['private', 'public', 'public/to_review', 'online'];
      setFilters(filters);

      const storedUser = sessionStorage.getItem('user');
      const loginTime = sessionStorage.getItem('loginTime');
      const currentTime = Date.now();

      if (storedUser && loginTime) {
        const timePassed = currentTime - loginTime;

        // Calcola il tempo rimanente da quando si è loggato
        if (timePassed >= TIMEOUT) {
          handleLogout();
        } else {
          const timeRemaining = TIMEOUT - timePassed;

          logoutTimeoutID = setTimeout(() => {
            handleLogout();
          }, timeRemaining);
          setUser(JSON.parse(storedUser));
          setLoggedIn(true);
        }
      } else {
        setUser(null);
        setLoggedIn(false);
      }

      setLoading(false);
    };

    init();
  }, []);  // This useEffect is called only the first time the component is mounted.

  const displayFilmSelection = (topic, parsedMessage) => {
    setFilmSelections(currentArray => {
      var newArray = [...currentArray];

      console.log(newArray);

      var index = newArray.findIndex(x => x.filmId === parseInt(topic));
      let objectStatus = { filmId: parseInt(topic), userName: parsedMessage.userName, status: parsedMessage.status };
      if (index === -1) { // If the filmId is not present in the array, add it
        newArray.push(objectStatus);
      } else { // If the filmId is already present in the array, update it
        newArray[index] = objectStatus;
      }
      return newArray;
    });
  };

  /**
   * This function handles the login process.
   * It requires a email and a password inside a "credentials" object.
   */
  const handleLogin = async (filmManager, credentials) => {
    try {
      if (loggedIn) {
        handleLogout();
      }

      const user = await API.logIn(filmManager, credentials);

      logoutTimeoutID = setTimeout(() => {
        handleLogout();
      }, TIMEOUT); // 5 minutes

      sessionStorage.setItem('user', JSON.stringify(user))
      sessionStorage.setItem('userId', user.id);
      sessionStorage.setItem('username', user.name);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('loginTime', Date.now());
      setUser(user);
      setLoggedIn(true);
    } catch (err) {
      // error is handled and visualized in the login form, do not manage error, throw it
      throw err;
    }
  };

  /**
   * This function handles the logout process.
   */
  const handleLogout = () => {
    console.info('Logout');
    setLoggedIn(false);
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');
    clearTimeout(logoutTimeoutID);
  };

  return (
    <>
      <Navigation logout={handleLogout} user={user} loggedIn={loggedIn} filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} />

      <Routes>
        <Route path="/" element={loading ? <LoadingLayout /> : <DefaultLayout filters={filters} onlineList={onlineList} />} >
          <Route index element={<PublicLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} loggedIn={loggedIn} />} />
          <Route path="private" element={loggedIn ? <PrivateLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} /> : <LoginRequired />} />
          <Route path="private/add" element={loggedIn ? <AddPrivateLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} /> : <LoginRequired />} />
          <Route path="private/edit/:filmId" element={loggedIn ? <EditPrivateLayout /> : <LoginRequired />} />
          <Route path="public" element={<PublicLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} loggedIn={loggedIn} />} />
          <Route path="public/add" element={loggedIn ? <AddPublicLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} /> : <LoginRequired />} />
          <Route path="public/edit/:filmId" element={loggedIn ? <EditPublicLayout /> : <LoginRequired />} />
          <Route path="public/:filmId/reviews" element={loggedIn ? <ReviewLayout /> : <LoginRequired />} />
          <Route path="public/:filmId/reviews/complete" element={loggedIn ? <EditReviewLayout /> : <LoginRequired />} />
          <Route path="public/:filmId/issue" element={loggedIn ? <IssueLayout filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} /> : <LoginRequired />} />
          <Route path="public/to_review" element={loggedIn ? <PublicToReviewLayout onlineList={onlineList} filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} user={JSON.parse(sessionStorage.getItem('user'))} mqttClient={mqttClient} subscribedTopics={subscribedTopics} setSubscribedTopics={setSubscribedTopics} filmSelections={filmSelections} /> : <LoginRequired />} />
          <Route path="online" element={<OnlineLayout onlineList={onlineList} />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>

        <Route path="/login" element={<LoginLayout login={handleLogin} filmManager={JSON.parse(sessionStorage.getItem('filmManager'))} />} />
      </Routes>
    </>
  );
}

export default App;
