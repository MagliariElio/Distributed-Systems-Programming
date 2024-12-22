'use strict';

const sqlite = require('sqlite3');
const path = require('path');
const fs = require('fs');

const DBSOURCE = path.join(__dirname, './databaseV2.db');
const SCHEMA_PATH = path.join(__dirname, './schema_db.sql');

const readSQLFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading SQL file: ${error.message}`);
        throw error;
    }
};

// Open the database
const openDatabase = () => {
    if (!fs.existsSync(DBSOURCE)) {
        console.log("Database not found, creating new database...");

        const db = new sqlite.Database(DBSOURCE, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
                throw err;
            }

            db.exec('PRAGMA foreign_keys = ON;', (error) => {
                if (error) {
                    console.error("PRAGMA statement failed:", error.message);
                }
            });

            const schemaSQL = readSQLFile(SCHEMA_PATH);
            db.exec(schemaSQL, (err) => {
                if (err) {
                    console.error("Error creating tables:", err.message);
                    throw err;
                }
                console.log("Database and tables created successfully.");
            });
        });
        return db;
    } else {
        // Se il database esiste, aprilo normalmente
        console.log("Database exists, opening existing database...");

        const db = new sqlite.Database(DBSOURCE, sqlite.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
                throw err;
            }

            db.exec('PRAGMA foreign_keys = ON;', (error) => {
                if (error) {
                    console.error("PRAGMA statement failed:", error.message);
                }
            });
        });
        return db;
    }
};

module.exports = openDatabase;