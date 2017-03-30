var express = require('express')
var bodyParser = require('body-parser');
var request = require('request');
var jsen = require('jsen');

var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function validateData(data, res, err, schemaResponse) {
	if (err) {
		console.log('unable to fetch Schema')
		res.status(500).send('Unable to fetch Schema');
		return
	}
	var schema = schemaResponse.body;
	// This validates that the schema being used is itself valid
	var hyperSchemaValidator = jsen({"$ref": "http://json-schema.org/draft-04/schema#"});
	var isSchemaValid = hyperSchemaValidator(schema);
	if (!isSchemaValid) {
		console.log('invalid schema');
		res.status(500).send('Provided schema is invalid');
	} else {
		console.log('valid schema');
		// This validates the data against the provided schema
		var schemaValidator = jsen(schema);
		console.log('checking data');
		var isDataValid = schemaValidator(data);
		if (isDataValid) {
			console.log('data conforms to provided schema');
			res.send('data conforms to provided schema');
		} else {
			console.log('data does not conform to provided schema'),
			console.log('error: ', schemaValidator.errors);
			res.status(400).send('data does not conform to provided schema: ');
		}
	}
}

app.get('/', function (req, res) {
	res.send('Welcome to my court!')
})

app.post('/test', function (req, res) {
	//console.dir(JSON.stringify(req.body))
	var schemaUrl = req.body.$schema;
	console.log('$schema: ' + schemaUrl)
	var options = {
		uri: schemaUrl,
		json: true
	};
	
	request(options, validateData.bind(null, req.body, res));
});

app.options('/test', function( req, res) {
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin,content-type,accept');
	res.header('Allow', 'OPTIONS,HEAD,POST,GET');
	res.sendStatus(204) ;
});

app.listen(port, function () {
	console.log('Example app listening on port ' + port)
})
