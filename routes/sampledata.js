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

			stmt.finalize();

 			var beads = [
				{'name':'Beige Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'ベージュ', 'desc':'骨髄穿刺・骨髄生検・関節穿刺'},
				{'name':'White Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'白', 'desc':'化学療法・予防接種'},
				{'name':'Blue Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'青', 'desc':'外来'},
				{'name':'Gray Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'シルバー', 'desc':'ガーゼ交換'},
				{'name':'Magenta Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'赤紫', 'desc':'救急外来・救急車'},
				{'name':'Tortoise Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':54, 'name_jp':'べっこう', 'desc':'腰椎穿刺'},
				//{'name':'Brown Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'茶色', 'desc':'髪の毛の変化'},
				{'name':'Fimo Girl', 'type':'Special', 'qty':200, 'lotsize':30, 'price':12, 'name_jp':'顔（女の子）', 'desc':'髪の毛の変化'},
				{'name':'Purple Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'紫', 'desc':'点滴・PCA・抗生剤'},
				{'name':'Glass Star', 'type':'Special', 'qty':200, 'lotsize':90, 'price':18, 'name_jp':'星', 'desc':'手術'},
				{'name':'Lime Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'黄緑（ライム）', 'desc':'隔離・発熱・好中球減少'},
				{'name':'Yellow Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'黄色', 'desc':'入院'},
				{'name':'Orange Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'オレンジ', 'desc':'ライン留置・抜去'},
				{'name':'Bumpy Bead', 'type':'Special', 'qty':200, 'lotsize':30, 'price':8, 'name_jp':'でこぼこ', 'desc':'何かを乗り越えたとき'},
				{'name':'Black Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'黒', 'desc':'穿刺'},
				{'name':'Glow in the Dark', 'type':'Special', 'qty':200, 'lotsize':500, 'price':30, 'name_jp':'蛍光', 'desc':'放射線'},
				{'name':'Dark Green Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'深緑', 'desc':'幹細胞採取・透析・筋膜切開・高カロリー輸液'},
				{'name':'Light Green Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'薄緑', 'desc':'検査・画像検査'},
				{'name':'Red Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'赤', 'desc':'輸血・血液製剤・アフェレーシス'},
				{'name':'Aqua Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'水色（アクア）', 'desc':'管の留置'},
				{'name':'Square Heart', 'type':'Special', 'qty':200, 'lotsize':60, 'price':24, 'name_jp':'四角いハート', 'desc':'ICUへの移動'},
				{'name':'Rainbow Bead', 'type':'Special', 'qty':200, 'lotsize':300, 'price':18, 'name_jp':'虹色', 'desc':'医療スタッフの訪問'},
				{'name':'Birthday Bead', 'type':'Special', 'qty':200, 'lotsize':100, 'price':36, 'name_jp':'セラミックバースデービーズ', 'desc':'お誕生日'},
				{'name':'Apple Bead', 'type':'Special', 'qty':200, 'lotsize':100, 'price':36, 'name_jp':'リンゴのセラミックビーズ', 'desc':'学校に通いはじめたとき'},
				{'name':'Graduation Bead', 'type':'Special', 'qty':200, 'lotsize':50, 'price':30, 'name_jp':'卒業のビーズ', 'desc':'卒業など、病院外の活動が終了したとき'},
				{'name':'Challenge Bead', 'type':'Special', 'qty':200, 'lotsize':null, 'price':null, 'name_jp':'セラミックビーズ（チャレンジビーズ）', 'desc':'チャレンジビーズ'},
				{'name':'100 Beads Club', 'type':'Special', 'qty':200, 'lotsize':300, 'price':43, 'name_jp':'チューブ型の樹脂ビーズ', 'desc':'ビーズ100個ごとに受け取る'},
				{'name':'Fish Bead', 'type':'Special', 'qty':200, 'lotsize':50, 'price':37.5, 'name_jp':'魚のビーズ', 'desc':'病棟移動・治療のために転院したとき'},
				{'name':'Sun and Moon', 'type':'Special', 'qty':200, 'lotsize':50, 'price':37.5, 'name_jp':'月と太陽の金属ビーズ', 'desc':'子どもが研究に参加したとき'},
				{'name':'Bone Bead', 'type':'Special', 'qty':200, 'lotsize':50, 'price':25, 'name_jp':'骨のビーズ', 'desc':'退院（許可）'},
				{'name':'Handmade Bead', 'type':'Special', 'qty':200, 'lotsize':null, 'price':null, 'name_jp':'ハンドメイドガラスビーズ', 'desc':'骨髄移植したとき'},
				{'name':'Anchor Charm', 'type':'Special', 'qty':200, 'lotsize':50, 'price':30, 'name_jp':'いかりの金属チャーム', 'desc':'診断・再発・その他困難な出来事'},
				{'name':'Acorn Charm', 'type':'Special', 'qty':200, 'lotsize':50, 'price':30, 'name_jp':'どんぐり型の金属チャーム', 'desc':'心理士などサポートスタッフとお話ししたとき'},
				{'name':'Team Beads of Courage', 'type':'Special', 'qty':200, 'lotsize':null, 'price':null, 'name_jp':'チーム・ビーズ・オブ・カレッジ', 'desc':'治療期間中で特に勇気が必要なとき、誰かのパワーを必要とするとき'},
				{'name':'Sponsor Bead', 'type':'Special', 'qty':200, 'lotsize':null, 'price':null, 'name_jp':'スポンサービーズ', 'desc':'治療期間中で特に勇気が必要なとき、誰かの応援を必要とするとき'},
				{'name':'Bracelet', 'type':'Special', 'qty':200, 'lotsize':null, 'price':null, 'name_jp':'ちからのブレスレット', 'desc':'誰かの応援を必要とする（身に着けていたい）とき'},
				{'name':'Purple Heart', 'type':'Special', 'qty':200, 'lotsize':15, 'price':60, 'name_jp':'紫のハート', 'desc':'治療の終了'},
				{'name':'Parent Heart', 'type':'Special', 'qty':200, 'lotsize':50, 'price':15, 'name_jp':'ペアレントビーズ', 'desc':'治療が終了したときに両親が受け取る'},
				{'name':'Pink Bead', 'type':'Color', 'qty':200, 'lotsize':500, 'price':18, 'name_jp':'ピンク', 'desc':'人工呼吸管理'},
				{'name':'Helping Hand', 'type':'Special', 'qty':200, 'lotsize':50, 'price':30, 'name_jp':'手のひらの金属チャーム', 'desc':''},
				{'name':'String', 'type':'Other', 'qty':100, 'lotsize':200, 'price':35, 'name_jp':'ビーズひも', 'desc':''},
				{'name':'Beads Bag', 'type':'Other', 'qty':10, 'lotsize':null, 'price':null, 'name_jp':'ビーズバッグ', 'desc':''},
				{'name':'A Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'A', 'desc':''},
				{'name':'B Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'B', 'desc':''},
				{'name':'C Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'C', 'desc':''},
				{'name':'D Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'D', 'desc':''},
				{'name':'E Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'E', 'desc':''},
				{'name':'F Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'F', 'desc':''},
				{'name':'G Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'G', 'desc':''},
				{'name':'H Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'H', 'desc':''},
				{'name':'I Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'I', 'desc':''},
				{'name':'J Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'J', 'desc':''},
				{'name':'K Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'K', 'desc':''},
				{'name':'L Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'L', 'desc':''},
				{'name':'M Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'M', 'desc':''},
				{'name':'N Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'N', 'desc':''},
				{'name':'O Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'O', 'desc':''},
				{'name':'P Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'P', 'desc':''},
				{'name':'Q Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'Q', 'desc':''},
				{'name':'R Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'R', 'desc':''},
				{'name':'S Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'S', 'desc':''},
				{'name':'T Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'T', 'desc':''},
				{'name':'U Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'U', 'desc':''},
				{'name':'V Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'V', 'desc':''},
				{'name':'W Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'W', 'desc':''},
				{'name':'X Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'X', 'desc':''},
				{'name':'Y Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'Y', 'desc':''},
				{'name':'Z Bead', 'type':'Alphabet', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'Z', 'desc':''},
				{'name':'0 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'0', 'desc':''},
				{'name':'1 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'1', 'desc':''},
				{'name':'2 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'2', 'desc':''},
				{'name':'3 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'3', 'desc':''},
				{'name':'4 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'4', 'desc':''},
				{'name':'5 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'5', 'desc':''},
				{'name':'6 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'6', 'desc':''},
				{'name':'7 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'7', 'desc':''},
				{'name':'8 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'8', 'desc':''},
				{'name':'9 Bead', 'type':'Number', 'qty':200, 'lotsize':40, 'price':14, 'name_jp':'9', 'desc':''}
			];

			db.run("CREATE TABLE if not exists beads (name TEXT, type TEXT, lotsize INTEGER, price INTEGER, name_jp, desc)");
			var stmt = db.prepare("INSERT INTO beads VALUES (?, ?, ?, ?, ?, ?)");
			/*
			for (var i = 0; i < 10; i++) {
		  	name = "Bead Type " + i;
		  	var qty = Math.trunc((Math.random()*10000)/100);
		  	var price =  Math.trunc((Math.random()*10000)/10000)*100 + 1000;
				stmt.run(name, 100, price);
			}
			*/

			for (var i = 0, len = beads.length; i < len; i++){
				stmt.run(beads[i].name, beads[i].type, beads[i].lotsize, beads[i].price, beads[i].name_jp, beads[i].desc)
			}
			stmt.finalize();

			db.run("CREATE TABLE if not exists inventory (asof DATE, name TEXT, qty INTEGER, party TEXT, timestamp TIMESTAMP DEFAULT (DATETIME('now', 'localtime')))");
			var stmt = db.prepare("INSERT INTO inventory (asof, name, qty, party) VALUES (?, ?, ?, ?)");
			var asof = moment().add(-1, 'days');

			/*
			db.each("SELECT name FROM beads", function(err, row) {
				stmt.run(asof.format("YYYY/MM/DD"), row.name, 0, 'Initialize');
			});
			*/

			for (var i = 0, len = beads.length; i < len; i++){
				stmt.run(asof.format("YYYY/MM/DD"), beads[i].name, beads[i].qty, 'Initialize')
			}
			stmt.finalize();

			/*
			for (var j=0; j < 6; j++){
		  	for (var i = 0; i < 10; i++) {
			    name = "Bead Type " + i;
			    var qty = Math.trunc((Math.random()*10000)/100);
			    var party = "DUMMY";
					stmt.run(asof.format("YYYY/MM/DD"), name, qty, party);
			  }
        asof = moment(asof).add(-1, 'days');
			}
			stmt.finalize();
			*/
		});
		db.close();
}
module.exports = initialize;
