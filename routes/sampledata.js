var moment = require('moment');
var dbpath = "data/dbfile.db";

var initialize = function (err, done) {
		var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database(dbpath);
		var check;
		db.serialize(function() {
			db.run("CREATE TABLE if not exists inventory (asof DATE, bead_type TEXT, qty INTEGER, party TEXT )");
			var stmt = db.prepare("INSERT INTO inventory VALUES (?, ?, ?, ?)");
			var asof = moment();	

		for (var j=0; j < 6; j++){
		  	for (var i = 0; i < 10; i++) {
			    bead_type = "Bead Type " + i;
			    var qty = Math.trunc((Math.random()*10000)/100);
			    var party = "DUMMY";
				stmt.run(asof.format("YYYY/MM/DD"), bead_type, qty, party);
			  }
              asof = moment(asof).add(-1, 'days');  
		}
		stmt.finalize();

		db.run("CREATE TABLE if not exists hospitals (name TEXT, address TEXT, phone TEXT)");
		var stmt = db.prepare("INSERT INTO hospitals VALUES (?, ?, ?)");
		stmt.run('Chiba', '1-1-2 Hamacho', '01234567890');
		stmt.run('Tokyo', '1-1-2 Nakano', '9128912891');
		stmt.run('Nagoya', '1-2-2 Kori machi', '2676876872');
		stmt.run('Yokohama', '1-1-2 Naka Ku', '2827892789');
		stmt.run('Shizuoka', '1-1-2 Shizuoka', '98798789');
		stmt.finalize();

		db.run("CREATE TABLE if not exists beads (bead_type TEXT, lotsize INTEGER, price INTEGER)");
		var stmt = db.prepare("INSERT INTO beads VALUES (?, ?, ?)");
	  	for (var i = 0; i < 10; i++) {
		    bead_type = "Bead Type " + i;
		    var qty = Math.trunc((Math.random()*10000)/100);
		    var price =  Math.trunc((Math.random()*10000)/10000)*100 + 1000;
			stmt.run(bead_type, 100, price);
		}
		stmt.finalize();
	});
	db.close();
} 
module.exports = initialize;