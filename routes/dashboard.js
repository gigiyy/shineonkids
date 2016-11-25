var express = require('express');
var moment = require('moment');
var router = express.Router();
//var dbpath = "data/dbfile.db";
//var sqlite3 = require('sqlite3');

var connection = require('./connection');
var pg = require('pg');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

router.get('/summary', function(req, res) {
    var results = [];
    //var db = new sqlite3.Database(dbpath);
    var sql = "SELECT to_char(i.asof, 'YYYY/MM/DD') asof, b.name, b.lotsize, sum(case when i.party = 'Order' then 0 else i.qty end) qty, "
            + "sum(case when i.party = 'Order' then i.qty when i.party = 'Receive' then -1 * i.qty else 0 end) backorder_qty "
            + "FROM inventory i RIGHT OUTER JOIN beads b "
            + "ON i.name = b.name "
            + "GROUP BY i.asof, i.name, b.type, b.name, b.lotsize "
            + "ORDER BY case when b.type = 'Color' then 1 when b.type = 'Special' then 2 when b.type = 'Alphabet' then 8 when b.type = 'Number' then 9 else 5 end, b.name, i.asof desc";

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
            console.log("ERROR/get/summary:", error);
        })
        .finally(function () {
            pgp.end();
            return res.json(results);
        });
});

router.get('/details', function(req, res) {
    var results = [];
    //var db = new sqlite3.Database(dbpath);
    var sql = "SELECT to_char(asof, 'YYYY/MM/DD') asof, name, qty, party FROM inventory order by timestamp desc, asof desc, name asc";

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
            console.log("ERROR/get/details:", error);
        })
        .finally(function () {
            pgp.end();
            return res.json(results);
        });
});

router.post('/',  function(req, res) {
    var results = [];
    //var db = new sqlite3.Database(dbpath);
    //var sql = "INSERT INTO inventory (asof, name, qty, party) VALUES (?, ?, ?, ?)";
    var sql = "INSERT INTO inventory (asof, name, qty, party) VALUES ($1, $2, $3, $4)";
    var newInventory = {
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party
    };

    var asof = moment().format("YYYY/MM/DD");

    /*
    db.run(sql, [asof, newInventory.name, newInventory.qty, newInventory.party], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
    */

    connection.result(sql, [asof, newInventory.name, newInventory.qty, newInventory.party])
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
    //var sql = "DELETE FROM inventory WHERE asof = ? and name = ? and qty = ? and party = ?";
    var sql = "DELETE FROM inventory WHERE asof = $1 and name = $2 and qty = $3 and party = $4";
    var delInventory = {
        asof: req.body.asof,
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party
    };

    /*
    db.run(sql, [delInventory.asof, delInventory.name, delInventory.qty, delInventory.party], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
    */

    connection.result(sql, [delInventory.asof, delInventory.name, delInventory.qty, delInventory.party])
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
