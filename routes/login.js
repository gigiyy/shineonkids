var express = require('express');
var router = express.Router();
//var dbpath = "data/dbfile.db";
//var sqlite3 = require('sqlite3').verbose();

router.get('/', function(req, res) {
    return(res.json(req.session.user));
});

router.post('/', function(req, res) {
  var user = req.body.user;
  var password = req.body.password;

  if (user == "sokids" && password == "boc") {
    req.session.user = user;
    res.redirect('.');
  } else {
    res.redirect('.');
  }
});

module.exports = router;
