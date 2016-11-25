var express = require('express');
var router = express.Router();
//var dbpath = "data/dbfile.db";
//var sqlite3 = require('sqlite3').verbose();
var connection = require('./connection');
var pg = require('pg');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

router.get('/',  function(req, res) {

    var results = [];
    //var db = new sqlite3.Database(dbpath);
    var sql = "SELECT name, type, lotsize, price, name_jp, description FROM beads "
            + "ORDER BY CASE WHEN type = 'Color' THEN 1 WHEN type = 'Special' THEN 2 WHEN type = 'Alphabet' THEN 8 WHEN type = 'Number' THEN 9 ELSE 5 END, name";

    /*
    function callback(rows) {
        results = rows;
        return(res.json(results));
    }

    db.all(sql, function(err, rows) {
        if (err) callback (null);
        callback(rows);
    });
    */

    connection.result(sql)
        .then(function (data) {
            results = data.rows;
        })
        .catch(function (error) {
            console.log("ERROR/get:", error);
        })
        .finally(function () {
            pgp.end();
            return res.json(results);
        });
});


router.put('/',  function(req, res) {
    var newBead = {
        name: req.body.name,
        type: req.body.type,
        lotsize: req.body.lotsize,
        price: req.body.price,
        name_jp: req.body.name_jp,
        description: req.body.description
    };

    var results = [];

    /*
    var db = new sqlite3.Database(dbpath);
    db.run("UPDATE beads SET type = ?, lotsize = ?, price = ?, name_jp = ?, desc = ? WHERE name = ?",
    [newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.desc, newBead.name], function(err, rows) {
            if(err) {
                return err;
            }
            return;
    });
    */

    connection.result("UPDATE beads SET type = $1, lotsize = $2, price = $3, name_jp = $4, description = $5 WHERE name = $6",
    [newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.description, newBead.name])
        .then(function (data) {

        })
        .catch(function (error) {
            console.log("ERROR/put:", error);
            res.send(false);
        })
        .finally(function () {
            pgp.end();
            res.send(true);
        });
});

router.post('/',  function(req, res) {
    var results = [];
    //var db = new sqlite3.Database(dbpath);
    //var sql = "INSERT INTO beads VALUES (?, ?, ?, ?, ?, ?)";
    var sql = "INSERT INTO beads VALUES ($1, $2, $3, $4, $5, $6)";

    var newBead = {
        name: req.body.name,
        type: req.body.type,
        lotsize: req.body.lotsize,
        price: req.body.price,
        name_jp: req.body.name_jp,
        description: req.body.description
    };

    /*
    db.run(sql, [newBead.name, newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.desc], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
    */

    connection.result(sql, [newBead.name, newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.description])
        .then(function (data) {

        })
        .catch(function (error) {
            console.log("ERROR/post:", error);
            res.send(false);
        })
        .finally(function () {
            pgp.end();
            res.send(true);
        });
});


router.put('/delete',  function(req, res) {
    var results = [];
    //var db = new sqlite3.Database(dbpath);
    //var sql = "DELETE FROM beads WHERE name = ?";
    var sql = "DELETE FROM beads WHERE name = $1";
    var delBead = {
        name: req.body.name
    };

    /*
    db.run(sql, [delBead.name], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
    */

    connection.result(sql, [delBead.name])
        .then(function (data) {
        })
        .catch(function (error) {
            console.log("ERROR/put/delete:", error);
            res.send(false);
        })
        .finally(function () {
            pgp.end();
            res.send(true);
        });
});

module.exports = router;
