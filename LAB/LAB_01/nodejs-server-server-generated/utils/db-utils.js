const openDatabase = require('../database/db');
const db = openDatabase();
const User = require('../components/User');
const NewUser = require('../components/NewUser');
const Users = require('../components/Users');
const Film = require('../components/Film');
const Films = require('../components/Films');
const Review = require('../components/Review');
const Reviews = require('../components/Reviews');

exports.mapObjToUser = function (row) {
    if (!row) return undefined;
    return new User(row.id, row.email, row.name);
};

exports.mapObjToNewUser = function (row) {
    if (!row) return undefined;
    return new NewUser(row.email, row.hash, row.name);
};

exports.mapObjToFilm = function (row) {
    if (!row) return undefined;
    return new Film(row.id, row.title, row.owner, row.watchDate, row.rating, row.favorite, row.private);
};

exports.mapObjToFilms = function (row) {
    if (!row) return undefined;
    return new Films(row.totalPages, row.currentPage, row.totalItems, row.films);
};

exports.mapObjToUsers = function (row) {
    if (!row) return undefined;
    return new Users(row.totalPages, row.currentPage, row.totalItems, row.users);
};

exports.mapObjToReview = function (row) {
    if (!row) return undefined;
    return new Review(row.filmId, row.reviewerId, row.completed, row.reviewDate, row.rating, row.reviewText);
}

exports.mapObjToReviews = function (row) {
    if (!row) return undefined;
    return new Reviews(row.totalPages, row.currentPage, row.totalItems, row.reviews, row.filmId);
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