var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3').verbose();

router.get('/',  function(req, res) {

    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT bead_type, lotsize, price FROM beads";

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
        bead_type: req.body.bead_type,
        lotsize: req.body.lotsize,
        price: req.body.price
    };

    var results = [];
    var db = new sqlite3.Database(dbpath);
    db.run("UPDATE beads SET lotsize = ?, price = ? WHERE bead_type = ?",
    [newBead.lotsize, newBead.price, newBead.bead_type], function(err, rows) {
            if(err) {
                return err;
            }
            return;
    });    

});
module.exports = router;