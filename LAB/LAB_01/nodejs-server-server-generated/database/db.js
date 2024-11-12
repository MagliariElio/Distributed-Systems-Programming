'use strict';

const sqlite = require('sqlite3');
const path = require('path');

const DBSOURCE = path.join(__dirname, './databaseV1.db');

// Open the database
const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }

    db.exec('PRAGMA foreign_keys = ON;', function(error)  {
        if (error){
            console.error("Pragma statement didn't work.")
        }
    });
});

module.exports = db;