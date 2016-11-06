var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3');
var moment = require('moment');

router.get('/summary', function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT i.asof, i.name, b.lotsize, sum(case when i.party = 'Order' then 0 else i.qty end) qty, "
            + "sum(case when i.party = 'Order' then i.qty when i.party = 'Receive' then -1 * i.qty else 0 end) backorder_qty "
            + "FROM inventory i, beads b "
            + "WHERE i.name = b.name group by i.asof, i.name, b.lotsize "
            + "ORDER BY case when type = 'Color' then 1 when type = 'Special' then 2 else 9 end, b.name, i.asof desc";

    function callback(rows) {
        results = rows;
        return(res.json(results));
    }

    db.all(sql, function(err, rows) {
        if (err) callback (null);
        callback(rows);
    });

});

router.get('/details', function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT asof, name, qty, party FROM inventory order by timestamp desc, asof desc, name asc";

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
    var sql = "INSERT INTO inventory (asof, name, qty, party) VALUES (?, ?, ?, ?)";
    var newInventory = {
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party
    };

    var asof = moment().format("YYYY/MM/DD");
    db.run(sql, [asof, newInventory.name, newInventory.qty, newInventory.party], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
});

router.put('/delete',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "DELETE FROM inventory WHERE asof = ? and name = ? and qty = ? and party = ?";
    var delInventory = {
        asof: req.body.asof,
        name: req.body.name,
        qty: req.body.qty,
        party: req.body.party
    };

    db.run(sql, [delInventory.asof, delInventory.name, delInventory.qty, delInventory.party], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
});

module.exports = router;
