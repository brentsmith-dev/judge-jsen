var express = require('express')
var bodyParser = require('body-parser');
var validation =  require('./utils/validation.js')

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Welcome to my court!')
})

app.post('/validate', function (req, res) {
	validation.judgeBeacon(req.body, res)
});

app.options('/validate', function( req, res) {
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin,content-type,accept');
	res.header('Allow', 'OPTIONS,HEAD,POST,GET');
	res.sendStatus(204) ;
});

app.listen(port, function () {
	console.log('Example app listening on port ' + port)
})
