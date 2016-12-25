var express = require('express');
var moment = require('moment');
var router = express.Router();
var connection = require('./connection');
var pg = require('pg');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

router.get('/summary', function(req, res) {
    var results = [];
    var sql = "SELECT to_char(i.asof, 'YYYY/MM/DD') asof, b.type, b.name, b.name_jp, b.lotsize, SUM(CASE WHEN i.party = 'Order' THEN 0 ELSE i.qty END) qty, "
            + "SUM(CASE WHEN i.party = 'Order' THEN i.qty WHEN i.party = 'Receive' THEN -1 * i.qty ELSE 0 END) backorder_qty "
            + "FROM inventory i RIGHT OUTER JOIN beads b "
            + "ON i.name = b.name "
            + "GROUP BY i.asof, i.name, b.type, b.name, b.name_jp, b.lotsize "
            + "ORDER BY case WHEN b.type = 'Process' THEN 1 "
            + "              WHEN b.type = 'Special' THEN 2 "
            + "              WHEN b.type = 'Alphabet' THEN 7 "
            + "              WHEN b.type = 'Number' THEN 8 "
            + "              WHEN b.type = 'Discontinued' THEN 9 "
            + "              ELSE 5 END, "
            + "b.type, b.name, i.asof DESC";

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
    var sql = "SELECT id, to_char(asof, 'YYYY/MM/DD') asof, name, qty, party FROM inventory order by asof desc, timestamp desc, name asc";

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
    var sql = "INSERT INTO inventory (asof, name, qty, party) VALUES ($1, $2, $3, $4)";
    var newInventory = {
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party
    };

    var asof = moment().utc().add(+9, 'hours').format("YYYY/MM/DD");

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

router.put('/',  function(req, res) {
    var results = [];
    var sql = "UPDATE inventory SET asof = $1, name = $2, qty = $3, party = $4 WHERE id = $5";
    var updInventory = {
        asof: req.body.asof,
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party,
        id: req.body.id
    };

    connection.result(sql, [updInventory.asof, updInventory.name, updInventory.qty, updInventory.party, updInventory.id])
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

router.put('/delete',  function(req, res) {
    var results = [];
    var sql = "DELETE FROM inventory WHERE id = $1";
    var delInventory = {
        id: req.body.id
    };

    connection.result(sql, [delInventory.id])
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
