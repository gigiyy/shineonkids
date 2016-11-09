var express = require('express');
var router = express.Router();
var dbpath = "data/dbfile.db";
var sqlite3 = require('sqlite3').verbose();

router.get('/',  function(req, res) {

    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "SELECT name, postal, address, phone, dept, title, contact1, contact2, email FROM hospitals";

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
        postal: req.body.postal,
        address: req.body.address,
        phone: req.body.phone,
        dept: req.body.dept,
        title: req.body.title,
        contact1: req.body.contact1,
        contact2: req.body.contact2,
        email: req.body.email
    };

    var results = [];
    var db = new sqlite3.Database(dbpath);
    db.run("UPDATE hospitals SET postal = ?, address = ?, phone = ?, dept = ?, title = ?, contact1 = ?, contact2 = ?, email = ? WHERE name = ?",
    [newHospital.postal, newHospital.address, newHospital.phone, newHospital.dept, newHospital.title, newHospital.contact1, newHospital.contact2, newHospital.email, newHospital.name], function(err, rows) {
            if(err) {
                return err;
            }
            return;
    });
});


router.post('/',  function(req, res) {
    var results = [];
    var db = new sqlite3.Database(dbpath);
    var sql = "INSERT INTO hospitals VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    var newHospital = {
        name: req.body.name,
        postal: req.body.postal,
        address: req.body.address,
        phone: req.body.phone,
        dept: req.body.dept,
        title: req.body.title,
        contact1: req.body.contact1,
        contact2: req.body.contact2,
        email: req.body.email
    };
    db.run(sql, [newHospital.name, newHospital.postal, newHospital.adress, newHospital.phone, newHospital.dept, newHospital.title, newHospital.contact1, newHospital.contact2, newHospital.email], function(err, rows) {
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
    var sql = "DELETE FROM hospitals WHERE name = ?";
    var delHospital = {
        name: req.body.name
    };

    db.run(sql, [delHospital.name], function(err, rows) {
            if(err) {
                console.log(err);
                return err;
            }
            return;
    });
});

module.exports = router;
