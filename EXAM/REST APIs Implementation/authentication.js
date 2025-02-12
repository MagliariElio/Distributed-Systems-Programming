'use strict';

var path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const ErrorResponse = require('./components/ErrorResponse');
const ErrorsPage = require('./utils/ErrorsPage');

/**
 * Helper function to initialize passport authentication with the LocalStrategy
 * 
 * @param app express app
 */
function inializeAuthentication(app, authenticateUser, getSingleUser) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async function verify(username, password, done) {
        const errorResponseUnAuthorized = new ErrorResponse(401, ErrorsPage.ERROR_INCORRECT_EMAIL_PASSWORD)
        const errorResponseGeneral = new ErrorResponse(500, ErrorsPage.ERROR_DATABASE)

        authenticateUser(username, password)
            .then(user => {
                if (user) done(null, user);
                else done(errorResponseUnAuthorized, false);
            })
            .catch((err) => done(errorResponseGeneral, false));
    }));

    // Serialization and deserialization of the user to and from a cookie
    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        getSingleUser(id)
            .then(user => done(null, user))
            .catch(e => done(e, null));
    })

    // Initialize express-session
    app.use(session({
        secret: "386e60adeb6f34186ae167a0cea7ee1dfa4109314e8c74610671de0ef9662191",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 300000 } //timeout of 5 minutes in milliseconds
    }));

    // Initialize passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(passport.authenticate('session'));
}

/**
 * Express middleware to check if the user is authenticated.
 * Responds with a 401 Unauthorized in case they're not.
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    const errorResponse = new ErrorResponse(401, ErrorsPage.ERROR_NOT_AUTHENTICATED)
    return res.status(401).json(errorResponse);
}

module.exports = { inializeAuthentication, isLoggedIn };