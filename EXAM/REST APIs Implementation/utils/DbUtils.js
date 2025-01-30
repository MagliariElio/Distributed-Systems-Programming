const openDatabase = require('../database/db');
const db = openDatabase();
const User = require('../components/User');
const NewUser = require('../components/NewUser');
const Users = require('../components/Users');
const Film = require('../components/Film');
const Films = require('../components/Films');
const Review = require('../components/Review');
const Reviews = require('../components/Reviews');
const EditReviewRequestDetails = require('../components/EditReviewRequestDetails');
const EditReviewRequests = require('../components/EditReviewRequests');

exports.mapObjToUser = function (row) {
    if (!row) return null;
    return new User(row.id, row.email, row.name);
};

exports.mapObjToNewUser = function (row) {
    if (!row) return null;
    return new NewUser(row.email, row.hash, row.name);
};

exports.mapObjToFilm = function (row) {
    if (!row) return null;
    return new Film(row.id, row.title, row.owner, row.watchDate, row.rating, row.favorite, row.private);
};

exports.mapObjToFilms = function (row) {
    if (!row) return null;
    return new Films(row.totalPages, row.currentPage, row.totalItems, row.films);
};

exports.mapObjToUsers = function (row) {
    if (!row) return null;
    return new Users(row.totalPages, row.currentPage, row.totalItems, row.users);
};

exports.mapObjToReview = function (row) {
    if (!row) return null;
    return new Review(row.filmId, row.reviewerId, row.completed, row.reviewDate, row.rating, row.reviewText, row.editReviewRequest);
};

exports.mapObjToReviews = function (row) {
    if (!row) return null;
    return new Reviews(row.totalPages, row.currentPage, row.totalItems, row.reviews, row.filmId);
};

exports.mapObjToEditReviewRequest = function (row, loggedUserId, isOwner) {
    if (!row) return null;
    return new EditReviewRequestDetails(row.filmId, row.reviewerId, row.deadline, row.status, loggedUserId, isOwner);
};

exports.mapObjToEditReviewRequests = function (row, isReceived) {
    if (!row) return null;
    return new EditReviewRequests(row.totalPages, row.currentPage, row.totalItems, row.requests, row.filmId, row.reviewerId, row.limit, row.status, isReceived);
};

/**
 * Wrapper around db.all
 */
exports.dbAllAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

/**
 * Wrapper around db.run
 */
exports.dbRunAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
    });
});

/**
 * Wrapper around db.get
 */
exports.dbGetAsync = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

/**
 * Edit Review Request Status
 */
exports.EditRequestStatus = Object.freeze({
    PENDING: 'pending',     // 0
    REJECTED: 'rejected',   // 1
    ACCEPTED: 'accepted',   // 2
    UNKNOWN: 'unknown'
});
