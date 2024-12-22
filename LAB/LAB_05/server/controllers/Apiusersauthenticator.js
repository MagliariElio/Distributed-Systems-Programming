'use strict';

const apiusersauthenticatorService = require('../service/ApiusersauthenticatorService');
const { getActiveFilmForReviewer } = require('../service/ApifilmspublicfilmIdselectionService');
const passport = require('passport');
const ErrorResponse = require('../components/ErrorResponse');
const WebSocket = require('../utils/WebSocket');
const WSMessage = require('../components/WSMessage');

module.exports.authenticateUser = async function authenticateUser(req, res, next) {
  if (req.isAuthenticated()) {
    const user = req.user;

    req.logout((err) => {
      if (err) {
        return next(err);
      }

      const message = new WSMessage(WebSocket.TypeMessageEnum.LOGOUT, user.id, undefined, undefined, undefined);
      WebSocket.sendAllClients(message);
      WebSocket.deleteMessage(message);

      console.log("logout");
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      // display wrong login messages
      const errorResponse = new ErrorResponse(401, info.message)
      return res.status(401).json(errorResponse);
    }
    // success, perform the login
    req.login(user, async (err) => {
      if (err) {
        return next(err);
      } else {
        const message = new WSMessage(WebSocket.TypeMessageEnum.LOGIN, req.user.id, req.user.name, undefined, undefined);

        const film = await getActiveFilmForReviewer(req.user.id);
        if (film) {
          message.filmId = film.id;
          message.filmTitle = film.title;
        }

        WebSocket.sendAllClients(message);
        WebSocket.saveMessage(message.userId, message);

        return res.json(req.user);
      }
    });
  })(req, res, next);
};
