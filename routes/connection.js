'use strict';
var promise = require('bluebird'); // or any other Promise/A+ compatible library;

var options = {
    promiseLib: promise // overriding the default (ES6 Promise);
};

var pgp = require('pg-promise')(options);


// Database connection details;
var cn = {
    host: 'localhost',
    port: 5432,
    database: 'boc',
    user: 'postgres',
    password: 'postgres'
    //ssl: true
};

var db = pgp(cn); // database instance;

module.exports = db;
