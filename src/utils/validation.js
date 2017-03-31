var request = require('request');
var jsen = require('jsen');

function judgeBeacon(data, response) {
	var schemaUrl = data.$schema;
	console.log('$schema: ' + schemaUrl)
	var options = {
		uri: schemaUrl,
		json: true
	};
	request(options, validateSchema.bind(null, data, response));
}


function validateSchema(data, response, err, schemaResponse) {
	if (err) {
		console.log('unable to fetch Schema')
		response.status(500).send('Unable to fetch Schema');
		return
	}
	var schema = schemaResponse.body;
	// This validates that the schema being used is itself valid
	var hyperSchemaValidator = jsen({"$ref": "http://json-schema.org/draft-04/schema#"});
	var isSchemaValid = hyperSchemaValidator(schema);
	if (!isSchemaValid) {
		console.log('invalid schema');
		response.status(500).send('Provided schema is invalid');
	} else {
		console.log('valid schema');
		validateData(data, schema, response)
	}
}

function validateData(data, schema, response) {
	console.log('valid schema');
	// This validates the data against the provided schema
	var schemaValidator = jsen(schema);
	console.log('checking data');
	var isDataValid = schemaValidator(data);
	if (isDataValid) {
		console.log('data conforms to provided schema');
		response.send('data conforms to provided schema');
	} else {
		console.log('data does not conform to provided schema'),
		console.log('error: ', schemaValidator.errors);
		response.status(400).send('data does not conform to provided schema: ' + JSON.stringify(schemaValidator.errors));
	}
}

module.exports.judgeBeacon = judgeBeacon;
module.exports.validateSchema = validateSchema;
module.exports.validateData = validateData;