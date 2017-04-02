var express = require('express');
var router = express.Router();
var connection = require('./connection');
var pg = require('pg');
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);

router.get('/',  function(req, res) {

  var results = [];
  var sql = "SELECT name, type, lotsize, price, name_jp, description FROM beads "
          + "ORDER BY CASE WHEN type = 'Process' THEN 1 "
          + "              WHEN type = 'Special' THEN 2 "
          + "              WHEN type = 'Alphabet' THEN 7 "
          + "              WHEN type = 'Number' THEN 8 "
          + "              WHEN type = 'Discontinued' THEN 9 "
          + "              ELSE 5 END, "
          + "type, name";

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
  var sql = "INSERT INTO beads VALUES ($1, $2, $3, $4, $5, $6)";

  var newBead = {
    name: req.body.name,
    type: req.body.type,
    lotsize: req.body.lotsize,
    price: req.body.price,
    name_jp: req.body.name_jp,
    description: req.body.description
  };

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
  var sql = "DELETE FROM beads WHERE name = $1";
  var delBead = {
    name: req.body.name
  };

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
