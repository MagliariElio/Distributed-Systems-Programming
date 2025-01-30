'use strict';

const passport = require('passport');
const ErrorResponse = require('../components/ErrorResponse');

module.exports.authenticateUser = async function authenticateUser(req, res, next) {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      console.info("logout");
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
        return res.json(req.user);
      }
    });
  })(req, res, next);
};
