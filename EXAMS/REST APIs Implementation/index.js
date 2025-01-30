'use strict';

var express = require('express');
var path = require('path');
var http = require('http');
var cors = require('cors');
var fs = require('fs');
var oas3Tools = require('oas3-tools');
var { Validator, ValidationError } = require('express-json-validator-middleware');
var isLoggedIn = require("./authentication").isLoggedIn

var serverPort = 3001;

/** Bean Imports **/
const FilmManager = require('./components/FilmManager');
const ErrorResponse = require('./components/ErrorResponse');
const ErrorsPage = require('./utils/ErrorsPage');

/** Controller Imports **/
var apiFilmsController = require('./controllers/Apifilms');
var apiFilmsPrivateController = require('./controllers/Apifilmsprivate');
var apiFilmsPrivateIdController = require('./controllers/ApifilmsprivatefilmId');
var apiFilmsPublicController = require('./controllers/Apifilmspublic');
var apiFilmsPublicIdController = require('./controllers/ApifilmspublicfilmId');
var apiFilmsPublicAssignmentsController = require('./controllers/Apifilmspublicassignments');
var apiFilmsPublicIdReviewsController = require('./controllers/ApifilmspublicfilmIdreviews');
var apiFilmsPublicIdReviewsReviewerIdController = require('./controllers/ApifilmspublicfilmIdreviewsreviewerId');
var apiFilmsPublicInvitedController = require('./controllers/Apifilmspublicinvited');
var apiUsersController = require('./controllers/Apiusers');
var apiUsersAuthenticatorController = require('./controllers/Apiusersauthenticator');
var apiUsersUserIdController = require('./controllers/ApiusersuserId');
var apifilmspublicfilmIdreviewseditrequestsController = require('./controllers/ApifilmspublicfilmIdreviewseditrequests');
var apifilmspublicfilmIdreviewsreviewerIdeditrequestsController = require('./controllers/ApifilmspublicfilmIdreviewsreviewerIdeditrequests');
var apifilmspublicreviewseditrequestsreceivedController = require('./controllers/Apifilmspublicreviewseditrequestsreceived');
var apifilmspublicreviewseditrequestssubmittedController = require('./controllers/Apifilmspublicreviewseditrequestssubmitted');
var utils = require('./utils/writer.js');

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
var corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

/*** Defining JSON validator middleware ***/
var filmCreateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/film', 'schema-film-create.json')).toString());
var filmUpdateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/film', 'schema-film-update.json')).toString());

var editReviewRequestCreateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/edit-review-request', 'schema-edit-review-request-create.json')).toString());
var editReviewRequestUpdateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/edit-review-request', 'schema-edit-review-request-update.json')).toString());

var userSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/user', 'schema-user.json')).toString());

var reviewCreateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/review', 'schema-review-create.json')).toString());
var reviewUpdateSchema = JSON.parse(fs.readFileSync(path.join('.', '../JSON Schemas/review', 'schema-review-update.json')).toString());

var validator = new Validator({ allErrors: true });

// defining all schemas
validator.ajv.addSchema([filmCreateSchema, filmUpdateSchema, editReviewRequestCreateSchema, editReviewRequestUpdateSchema, userSchema, reviewCreateSchema, reviewUpdateSchema]);
const addFormats = require('ajv-formats').default;
addFormats(validator.ajv);
var validate = validator.validate;

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, './controllers')
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, '../REST APIs Design/openapi.yaml'), options);
var app = expressAppConfig.getApp();
const server = http.createServer(app);

//app.use(morgan('dev'));
app.use(express.json({ extended: true }));
app.use(cors(corsOptions));

// Passport Setup
var authenticateUser = require('./service/ApiusersauthenticatorService').authenticateUser;
var getSingleUser = require('./service/ApiusersuserIdService').getSingleUser;
var inializeAuthentication = require('./authentication').inializeAuthentication;
inializeAuthentication(app, authenticateUser, getSingleUser);

//Route methods
app.get('/api', function (req, res, next) { utils.writeJson(res, new FilmManager()); });

// Film
app.post('/api/films', isLoggedIn, validate({ body: filmCreateSchema }), apiFilmsController.createFilm);

app.get('/api/films/private', isLoggedIn, apiFilmsPrivateController.getPrivateFilms);
app.get('/api/films/private/:filmId', isLoggedIn, apiFilmsPrivateIdController.getSinglePrivateFilm);
app.patch('/api/films/private/:filmId', isLoggedIn, validate({ body: filmUpdateSchema }), apiFilmsPrivateIdController.updateSinglePrivateFilm);
app.delete('/api/films/private/:filmId', isLoggedIn, apiFilmsPrivateIdController.deleteSinglePrivateFilm);

app.get('/api/films/public', apiFilmsPublicController.getPublicFilms);
app.get('/api/films/public/invited', isLoggedIn, apiFilmsPublicInvitedController.getInvitedFilms);
app.get('/api/films/public/:filmId', apiFilmsPublicIdController.getSinglePublicFilm);
app.patch('/api/films/public/:filmId', isLoggedIn, validate({ body: filmUpdateSchema }), apiFilmsPublicIdController.updateSinglePublicFilm);
app.delete('/api/films/public/:filmId', isLoggedIn, apiFilmsPublicIdController.deleteSinglePublicFilm);

app.post('/api/films/public/assignments', isLoggedIn, apiFilmsPublicAssignmentsController.assignReviewBalanced);

// Review
app.get('/api/films/public/:filmId/reviews', apiFilmsPublicIdReviewsController.getFilmReviews);
app.post('/api/films/public/:filmId/reviews', isLoggedIn, validate({ body: reviewCreateSchema }), apiFilmsPublicIdReviewsController.issueFilmReview);
app.patch('/api/films/public/:filmId/reviews', isLoggedIn, validate({ body: reviewUpdateSchema }), apiFilmsPublicIdReviewsController.updateSingleReview);

// Edit Review Request
app.post('/api/films/public/:filmId/reviews/editrequests', isLoggedIn, validate({ body: editReviewRequestCreateSchema }), apifilmspublicfilmIdreviewseditrequestsController.createReviewModificationRequest);
app.delete('/api/films/public/:filmId/reviews/editrequests', isLoggedIn, apifilmspublicfilmIdreviewseditrequestsController.cancelReviewRequest);

// Review
app.get('/api/films/public/:filmId/reviews/:reviewerId', apiFilmsPublicIdReviewsReviewerIdController.getSingleReview);
app.delete('/api/films/public/:filmId/reviews/:reviewerId', isLoggedIn, apiFilmsPublicIdReviewsReviewerIdController.deleteSingleReview);

// Edit Review Request
app.get('/api/films/public/:filmId/reviews/:reviewerId/editrequests', isLoggedIn, apifilmspublicfilmIdreviewsreviewerIdeditrequestsController.getReviewModificationRequest);
app.patch('/api/films/public/:filmId/reviews/:reviewerId/editrequests', isLoggedIn, validate({ body: editReviewRequestUpdateSchema }), apifilmspublicfilmIdreviewsreviewerIdeditrequestsController.updateReviewRequestStatus);

app.get('/api/films/public/reviews/editrequests/received', isLoggedIn, apifilmspublicreviewseditrequestsreceivedController.getReviewRequestsForFilm);

app.get('/api/films/public/reviews/editrequests/submitted', isLoggedIn, apifilmspublicreviewseditrequestssubmittedController.getReviewRequestsByReviewer);

// User
app.get('/api/users', isLoggedIn, apiUsersController.getUsers);
app.post('/api/users/authenticator', validate({ body: userSchema }), apiUsersAuthenticatorController.authenticateUser);
app.get('/api/users/:userId', isLoggedIn, apiUsersUserIdController.getSingleUser);

// Error handlers for validation and authentication errors
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    const errorResponse = new ErrorResponse(400, err)
    res.status(errorResponse.code).send(errorResponse);
  } else if (err instanceof ErrorResponse) {
    res.status(err.code).send(err);
  } else next(err)
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    const errorResponse = new ErrorResponse(401, ErrorsPage.ERROR_AUTHORIZATION)
    res.status(errorResponse.code).json(errorResponse);
  } else next(err);
});

// Initialize the Swagger middleware
server.listen(serverPort, function () {
  console.info('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.info('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

