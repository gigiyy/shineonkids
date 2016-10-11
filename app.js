var express = require('express');
var app = express();
var fs = require('fs');
var moment = require('moment');
var dbpath = "data/dbfile.db";
var sampledata = require('./routes/sampledata');

try{
    if (fs.statSync(dbpath).isFile()) {
    	console.log("Database initialized already");
    }
}catch (err){
	if (err.errno == -4058){
    	console.log("No db file exists");
    	console.log("Initializing database, please wait.....");
    	sampledata();
    	console.log("Database initialized!");
	} else
		console.log(err);
}

var bodyParser = require('body-parser');
var session = require('express-session');

// Route includes
var dashboard = require('./routes/dashboard');
var hospitals = require('./routes/hospitals');
var beads = require('./routes/beads');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Passport Session Configuration //
app.use(session({
    secret: 'secret',
    key: 'user',
    resave: 'true',
    saveUninitialized: false,
    cookie: {maxage: 60000, secure: false}
}));

// Routes
app.use('/dashboard', dashboard);
app.use('/hospitals', hospitals);
app.use('/beads', beads);

// Serve back static files
app.use(express.static('public'));
app.use(express.static('public/views'));
//app.use(express.static('public/assets'));
//app.use(express.static('public/assets/scripts'));
//app.use(express.static('public/assets/styles'));
//app.use(express.static('public/vendors'));

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get("port"), function(){
    console.log("Listening on port: " + app.get("port"));

});
