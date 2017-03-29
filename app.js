var express = require('express')
var bodyParser = require('body-parser');
var rpn = require('request-promise-native');
var jsen = require('jsen');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Welcome to my court!')
})

app.post('/test', function (req, res) {
	console.dir(JSON.stringify(req.body))
	var schemaUrl = req.body.$schema;
	console.log('$schema: ' + schemaUrl)

	var options = {
		uri: schemaUrl,
		json: true
	};
	
	rpn(options)
		.then(function(schema) {
			// This validates that the schema being used is itself valid
			var hyperSchemaValidator = jsen({"$ref": "http://json-schema.org/draft-04/schema#"});
			var isSchemaValid = hyperSchemaValidator(schema);
			if (!isSchemaValid) {
				console.log('invalid schema');
				res.status(500).send('Provided schema invalid');
			} else {
				console.log('valid schema');
				// This validates the data against the provided schema
				var schemaValidator = jsen(schema);
				var isDataValid = schemaValidator(req.body);
				if (isDataValid) {
					console.log('data conforms to provided schema');
					res.send('data conforms to provided schema');
				} else {
					console.log('data does not conform to provided schema'),
					console.log('error: ', validateData.errors);
					res.status(400).send('data does not conform to provided schema: ');
				}
			}
		}.bind(this))
		.catch(function (err) {
			console.log('unable to fetch Schema')
			res.status(500).send('Unable to fetch Schema');
		}.bind(this));
});

app.options('/test', function( req, res) {
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'origin,content-type,accept');
	res.header('Allow', 'OPTIONS,HEAD,POST,GET');
	res.sendStatus(204) ;
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
})
