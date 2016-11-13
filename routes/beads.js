var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3').verbose();

router.get('/',  function(req, res) {

    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT name, type, lotsize, price, name_jp, desc FROM beads "
            + "ORDER BY CASE WHEN type = 'Color' THEN 1 WHEN type = 'Special' THEN 2 WHEN type = 'Alphabet' THEN 8 WHEN type = 'Number' THEN 9 ELSE 5 END, name";

    function callback(rows) {
        results = rows;
        return(res.json(results));
    }

    db.all(sql, function(err, rows) {
        if (err) callback (null);
        callback(rows);
    });
});


router.put('/',  function(req, res) {
    var newBead = {
        name: req.body.name,
        type: req.body.type,
        lotsize: req.body.lotsize,
        price: req.body.price,
        name_jp: req.body.name_jp,
        desc: req.body.desc
    };

    var results = [];
    var db = new sqlite3.Database(dbpath);
    db.run("UPDATE beads SET type = ?, lotsize = ?, price = ?, name_jp = ?, desc = ? WHERE name = ?",
    [newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.desc, newBead.name], function(err, rows) {
            if(err) {
                return err;
            }
            return;
    });

});

router.post('/',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "INSERT INTO beads VALUES (?, ?, ?, ?, ?, ?)";

    var newBead = {
        name: req.body.name,
        type: req.body.type,
        lotsize: req.body.lotsize,
        price: req.body.price,
        name_jp: req.body.name_jp,
        desc: req.body.desc
    };

    db.run(sql, [newBead.name, newBead.type, newBead.lotsize, newBead.price, newBead.name_jp, newBead.desc], function(err, rows) {
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
    var sql = "DELETE FROM beads WHERE name = ?";
    var delBead = {
        name: req.body.name
    };

    db.run(sql, [delBead.name], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
});

module.exports = router;
