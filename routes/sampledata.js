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
			stmt.run('東京慈恵会医科大学附属病院','105-8471','東京都港区西新橋3-19-18','',
							 '4E病棟','主任','佐藤三由紀','','');
			stmt.run('東京医科歯科大学医学部附属病院','113-8510','東京都文京区湯島１丁目5-45','03-3813-6111（代）',
							 '小児科','CLS','村瀬　有紀子　','','');
			stmt.run('慶応義塾大学病院','160-0016','東京都新宿区信濃町35','',
							 '5S病棟','師長','岡本　陽子','','');
			stmt.run('東京都立小児総合医療センター','183-8561','東京都府中市武蔵台2-8-29','042-300-5111(代）',
							 '子ども・家族支援部門　','心理','高嶋　裕子　','','');
			stmt.run('神奈川県立こども医療センター','232-0066','横浜市南区六ツ川2-138-4','',
							 '','ファシリティドッグハンドラー','森田優子','','');
			stmt.run('千葉大学医学部附属病院','260-8677','千葉県千葉市中央区亥鼻 1-8-1','',
							 'みなみ棟3階  ','病棟保育士','山口、加藤','','');
			stmt.run('成田赤十字病院','286-0041','成田市飯田町90-1','0476-22-2311 (代）',
							 '小児科','医師','小泉　奈美','','');
			stmt.run('茨城県立こども病院','311-4145','茨城県水戸市双葉台3-3-1','',
							 '成育在宅支援室 ','CLS','松井　基子','','');
			stmt.run('静岡県立こども病院','420-0953','静岡県静岡市葵区漆山860','',
							 '北3病棟','師長','森田','','');
			stmt.run('中京病院','457-0866','愛知県名古屋市南区三条１−１−１０','',
							 '','レシピエント移植 コーディネーター','三浦　清世美','','');
			stmt.run('大阪市立総合医療センター','534-0021','大阪市都島区都島本通2丁目13番22号','（内線：山地さん6787）',
							 '小児血液腫瘍科　','HPS','山地　理恵　','','');
			stmt.run('大阪赤十字病院','543-8555','大阪市天王寺区筆ヶ崎町5-30','06-6774-5111',
							 '小児科病棟','師長','杉田　智惠子','苑田','c.sugita@osaka-med.jrc.or.jp');
			stmt.run('神戸大学医学部附属病院','650-0017','神戸市中央区楠町7-5-2','',
							 '小児科 ','心理士','万代　ツルエ','','');
			stmt.run('チャイルド・ケモ・クリニック','650-0046','神戸市中央区港島中町8-5-3','',
							 '','看護師','小島','','');
			stmt.run('兵庫県立こども病院','654-0081','兵庫県神戸市須磨区高倉台１-１-１','',
							 '血液・腫瘍患者主体病棟','師長','宗和　里美','井戸','');
			stmt.run('島根大学医学部附属病院','693-0021','島根県出雲市塩冶町89-1','0853(23)2111(代）',
							 '小児センター','保育士','椿　敦美　','','');
			stmt.run('高知医療センター','781-8555','高知県高知市池2125番地1','',
							 'すこやか4A（小児フロア）','看護科長','三浦由紀子','','');
			stmt.run('九州がんセンター','811-1395','福岡市南区野多目3-1-1','',
							 'サイコオンコロジー科','臨床心理士','白石　恵子','前原　葉子','');

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

			db.run("CREATE TABLE if not exists inventory (asof DATE, bead_type TEXT, qty INTEGER, party TEXT, timestamp TIMESTAMP DEFAULT (DATETIME('now', 'localtime')))");
			var stmt = db.prepare("INSERT INTO inventory (asof, bead_type, qty, party) VALUES (?, ?, ?, ?)");
			var asof = moment().add(-1, 'days');
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
