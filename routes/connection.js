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

// Heroku setting
//var cn = process.env.DATABASE_URL;
//var cn = {
//    host: 'ec2-54-235-78-240.compute-1.amazonaws.com',
//    port: 5432,
//    database: 'dffqran77u2g1q',
//    user: 'hrhglalgpqgqdu',
//    password: 'SZa96-2BMREH2IIyrX9GazYs_e',
//    ssl: true
//};

var db = pgp(cn); // database instance;

module.exports = db;
