const db = require('../database/db');
const User = require('../components/User');
const NewUser = require('../components/NewUser');
const Film = require('../components/Film');

exports.mapObjToUser = async (row) => {
    if(!row) return undefined;
    return new User(row.id, row.email, row.name);
}

exports.mapObjToNewUser = function (row) {
    if(!row) return undefined;
    return new NewUser(row.email, row.hash, row.name);
}

exports.mapObjToFilm = function (row) {
    if(!row) return undefined;
    return new Film(row.id, row.title, row.owner, row.watchDate, row.rating, row.favorite, row.private);
}

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