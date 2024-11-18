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
const Storage = require('./components/Storage')
const ErrorResponse = require('./components/ErrorResponse');
const ErrorsPage = require('./utils/ErrorsPage')

/** Controller Imports **/
var apiFilmsController = require('./controllers/Apifilms');
var apiFilmsPrivateController = require('./controllers/Apifilmsprivate');
var apiFilmsPrivateIdController = require('./controllers/ApifilmsprivatefilmId');
var apiFilmsPublicController = require('./controllers/Apifilmspublic');
var apiFilmsPublicIdController = require('./controllers/ApifilmspublicfilmId');
var apifilmspublicfilmIdimagesController = require('./controllers/ApifilmspublicfilmIdimages');
var apifilmspublicfilmIdimagesimageIdController = require('./controllers/ApifilmspublicfilmIdimagesimageId');
var apiFilmsPublicAssignmentsController = require('./controllers/Apifilmspublicassignments');
var apiFilmsPublicIdReviewsController = require('./controllers/ApifilmspublicfilmIdreviews');
var apiFilmsPublicIdReviewsReviewerIdController = require('./controllers/ApifilmspublicfilmIdreviewsreviewerId');
var apiFilmsPublicInvitedController = require('./controllers/Apifilmspublicinvited');
var apiUsersController = require('./controllers/Apiusers');
var apiUsersAuthenticatorController = require('./controllers/Apiusersauthenticator');
var apiUsersUserIdController = require('./controllers/ApiusersuserId');
var utils = require('./utils/writer.js');

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

/*** Defining JSON validator middleware ***/
var filmBaseSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/film', 'schema-film-base.json')).toString());
var filmCreateSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/film', 'schema-film-create.json')).toString());
var filmUpdateSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/film', 'schema-film-update.json')).toString());

var userBaseSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/user', 'schema-user-base.json')).toString());
var newUserSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/user', 'schema-new-user.json')).toString());

var reviewCreateSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/review', 'schema-review-create.json')).toString());
var reviewUpdateSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas/review', 'schema-review-update.json')).toString());

var validator = new Validator({ allErrors: true });

// defining base schemas
validator.ajv.addSchema(filmBaseSchema, 'schema-film-base.json');
validator.ajv.addSchema(userBaseSchema, 'schema-user-base.json');

// defining all schemas
validator.ajv.addSchema([filmCreateSchema, filmUpdateSchema, newUserSchema, reviewCreateSchema, reviewUpdateSchema]);
const addFormats = require('ajv-formats').default;
addFormats(validator.ajv);
var validate = validator.validate;

// swaggerRouter configuration
var options = {
  routing: {
    controllers: path.join(__dirname, './controllers')
  },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

//app.use(morgan('dev'));
app.use(express.json({ extended: true }));
app.use(cors(corsOptions));

// Passport Setup
var authenticateUser = require('./service/ApiusersauthenticatorService').authenticateUser;
var getSingleUser = require('./service/ApiusersuserIdService').getSingleUser;
var inializeAuthentication = require('./authentication').inializeAuthentication
inializeAuthentication(app, authenticateUser, getSingleUser);

//Route methods
app.get('/api', function (req, res, next) { utils.writeJson(res, new FilmManager()); });
app.post('/api/films', isLoggedIn, validate({ body: filmCreateSchema }), apiFilmsController.createFilm);

app.get('/api/films/private', isLoggedIn, apiFilmsPrivateController.getPrivateFilms);
app.get('/api/films/private/:filmId', isLoggedIn, apiFilmsPrivateIdController.getSinglePrivateFilm);
app.put('/api/films/private/:filmId', isLoggedIn, validate({ body: filmUpdateSchema }), apiFilmsPrivateIdController.updateSinglePrivateFilm);
app.delete('/api/films/private/:filmId', isLoggedIn, apiFilmsPrivateIdController.deleteSinglePrivateFilm);

app.get('/api/films/public', apiFilmsPublicController.getPublicFilms);
app.get('/api/films/public/invited', isLoggedIn, apiFilmsPublicInvitedController.getInvitedFilms);
app.get('/api/films/public/:filmId', apiFilmsPublicIdController.getSinglePublicFilm);
app.put('/api/films/public/:filmId', isLoggedIn, validate({ body: filmUpdateSchema }), apiFilmsPublicIdController.updateSinglePublicFilm);
app.delete('/api/films/public/:filmId', isLoggedIn, apiFilmsPublicIdController.deleteSinglePublicFilm);

app.get('/api/films/public/:filmId/images', isLoggedIn, apifilmspublicfilmIdimagesController.getImageListForPublicFilm);
app.post('/api/films/public/:filmId/images', Storage.uploadImg, isLoggedIn, apifilmspublicfilmIdimagesController.addImage);
app.delete('/api/films/public/:filmId/images', isLoggedIn, apifilmspublicfilmIdimagesController.deleteAllImagesAboutFilm);

app.get('/api/films/public/:filmId/images/:imageId', isLoggedIn, apifilmspublicfilmIdimagesimageIdController.getSingleImage);
app.delete('/api/films/public/:filmId/images/:imageId', isLoggedIn, apifilmspublicfilmIdimagesimageIdController.deleteSingleImage);

app.post('/api/films/public/assignments', isLoggedIn, apiFilmsPublicAssignmentsController.assignReviewBalanced);

app.get('/api/films/public/:filmId/reviews', apiFilmsPublicIdReviewsController.getFilmReviews);
app.post('/api/films/public/:filmId/reviews', isLoggedIn, validate({ body: reviewCreateSchema }), apiFilmsPublicIdReviewsController.issueFilmReview);
app.put('/api/films/public/:filmId/reviews', isLoggedIn, validate({ body: reviewUpdateSchema }), apiFilmsPublicIdReviewsController.updateSingleReview);

app.get('/api/films/public/:filmId/reviews/:reviewerId', apiFilmsPublicIdReviewsReviewerIdController.getSingleReview);
app.delete('/api/films/public/:filmId/reviews/:reviewerId', isLoggedIn, apiFilmsPublicIdReviewsReviewerIdController.deleteSingleReview);

app.get('/api/users', isLoggedIn, apiUsersController.getUsers);
app.post('/api/users/authenticator', validate({ body: newUserSchema }), apiUsersAuthenticatorController.authenticateUser);
app.get('/api/users/:userId', isLoggedIn, apiUsersUserIdController.getSingleUser);

// Error handlers for validation and authentication errors
app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    const errorResponse = new ErrorResponse(400, err)
    res.status(errorResponse.code).send(errorResponse);
  } else if(err instanceof ErrorResponse) {
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
http.createServer(app).listen(serverPort, function () {
  console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
  console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

