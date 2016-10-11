var moment = require('moment');
var dbpath = "data/dbfile.db";

var initialize = function (err, done) {
		var sqlite3 = require('sqlite3').verbose();
		var db = new sqlite3.Database(dbpath);
		var check;
		db.serialize(function() {
			db.run("CREATE TABLE if not exists hospitals (name TEXT, postal TEXT, address TEXT, phone TEXT, dept TEXT, title TEXT, contact1 TEXT, contact2 TEXT, email TEXT)");
			var stmt = db.prepare("INSERT INTO hospitals VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
			stmt.run('札幌医科大学附属病院', '060-8543', '札幌市中央区南1条西16丁目291番地', '011-611-2111（代）（内線 3422）',
							 '小児科看護室', '看護副師長', '三上', '', 'kayok@sapmed.ac.jp');
			//stmt.run('Tokyo', '1-1-2 Nakano', '9128912891');
			//stmt.run('Nagoya', '1-2-2 Kori machi', '2676876872');
			//stmt.run('Yokohama', '1-1-2 Naka Ku', '2827892789');
			//stmt.run('Shizuoka', '1-1-2 Shizuoka', '98798789');
			stmt.finalize();

 			var beads = [
				{'bead_type':'Beige Bead', 'qty':200, 'lotsize':500, 'price':18, 'bead_type_jp':'ベージュ', 'desc':'骨髄穿刺・骨髄生検・関節穿刺'},
				{'bead_type':'White Bead', 'qty':200, 'lotsize':500, 'price':18, 'bead_type_jp':'白', 'desc':'化学療法・予防接種'}
			];

			db.run("CREATE TABLE if not exists beads (bead_type TEXT, lotsize INTEGER, price INTEGER, bead_type_jp, desc)");
			var stmt = db.prepare("INSERT INTO beads VALUES (?, ?, ?, ?, ?)");
			/*
			for (var i = 0; i < 10; i++) {
		  	bead_type = "Bead Type " + i;
		  	var qty = Math.trunc((Math.random()*10000)/100);
		  	var price =  Math.trunc((Math.random()*10000)/10000)*100 + 1000;
				stmt.run(bead_type, 100, price);
			}
			*/
			//stmt.run('Beige Bead', 500, 18, 'ベージュ', '骨髄穿刺・骨髄生検・関節穿刺')
			//stmt.run('White Bead', 500, 18, '白', '化学療法・予防接種')
			for (var i = 0, len = beads.length; i < len; i++){
				stmt.run(beads[i].bead_type, beads[i].lotsize, beads[i].price, beads[i].bead_type_jp, beads[i].desc)
			}
			stmt.finalize();

			db.run("CREATE TABLE if not exists inventory (asof DATE, bead_type TEXT, qty INTEGER, party TEXT )");
			var stmt = db.prepare("INSERT INTO inventory VALUES (?, ?, ?, ?)");
			var asof = moment();
			//db.each("SELECT bead_type FROM beads", function(err, row) {
			//	stmt.run(asof.format("YYYY/MM/DD"), row.bead_type, 0, 'Initialize');
			//});
			//stmt.run(asof.format("YYYY/MM/DD"), 'Beige Bead', 0, 'Initialize')
			//stmt.run(asof.format("YYYY/MM/DD"), 'White Bead', 0, 'Initialize')
			for (var i = 0, len = beads.length; i < len; i++){
				stmt.run(asof.format("YYYY/MM/DD"), beads[i].bead_type, beads[i].qty, 'Initialize')
			}
			stmt.finalize();

			/*
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
			*/
		});
		db.close();
}
module.exports = initialize;
