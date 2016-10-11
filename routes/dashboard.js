var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3');
var moment = require('moment');

router.get('/summary',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT asof, bead_type, sum(qty) qty FROM inventory group by asof, bead_type order by asof desc";

    function callback(rows) {
        results = rows;
        return(res.json(results));
    }

    db.all(sql, function(err, rows) {
        if (err) callback (null);
        callback(rows);
    });

});

router.get('/details',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT asof, bead_type, qty, party FROM inventory order by asof desc, bead_type asc";

    function callback(rows) {
        results = rows;
        return(res.json(results));
    }

    db.all(sql, function(err, rows) {
        if (err) callback (null);
        callback(rows);
    });
});

router.post('/',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "INSERT INTO inventory VALUES (?, ?, ?, ?)";
    var newInventory = {
        bead_type: req.body.bead_type,
        qty: req.body.qty,
        party: req.body.party
    };

    var asof = moment().format("YYYY/MM/DD");
    db.run(sql, [asof, newInventory.bead_type, newInventory.qty, newInventory.party], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
});

module.exports = router;
