var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3').verbose();

router.get('/',  function(req, res) {

    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT name, address, phone FROM hospitals";

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
    var newHospital = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone
    };

    var results = [];
    var db = new sqlite3.Database(dbpath);
    db.run("UPDATE hospitals SET address = ?, phone = ? WHERE name = ?",
    [newHospital.address, newHospital.phone, newHospital.name], function(err, rows) {
            if(err) {
                return err;
            }
            return;
    });    

});
module.exports = router;