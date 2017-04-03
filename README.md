[![Build Status](https://travis-ci.org/statuswoe/judge-jesn.svg?branch=master)](https://travis-ci.org/statuswoe/judge-jesn)

# Judge Jsen
judge-jsen is a tiny service intended to allow easy validation of JSON payloads using a provided JSON schema.
It uses the excellent [jsen] validation tool.

[jsen]: https://github.com/bugventure/jsen

## Conventions
For judge-jsen to rule on a JSON payload it must first know what schema it is supposed to be using to validate against.
This is done by requiring the root object of the JSON payload contain a `$schema` property with a url to the schema to be validated against.

example payload:

    {
      "$schema": "https://raw.githubusercontent.com/statuswoe/judge-jsen/master/demo/demo.schema.json",
      "testString": "this is a test",
      "testInt": 12345
    }
    
contents of schema at https://raw.githubusercontent.com/statuswoe/judge-jsen/master/demo/demo.schema.json

    {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "type": "object",
      "properties": {
        "$schema": {
          "type": "string"
        },
        "testString": {
          "type": "string"
        },
        "testInt": {
          "type": "integer"
        }
      },
      "additionalProperties": false,
      "required": [
        "$schema",
        "testString",
        "testInt"
      ]
    }

## Usage
Simply check out the source and run  
    
    npm install
    node src/app.js
    
to start the service. Then you should be able to send POST requests to http://localhost:8000/validate to test the service.  
    
    curl -H "Accept: application/json" -H "Content-Type: application/json" --data-binary '{"$schema": "https://raw.githubusercontent.com/statuswoe/judge-jsen/master/demo/demo.schema.json", "testString": "this is a test", "testInt": 12345}' --compressed "http://localhost:8000/validate"
    
Responses to POST requests with valid schemas and a conforming JSON object should return a 200 response with a body similar to  
    
    data conforms to provided schema
    
Responses to POST requests with valid schemas but a non-conforming JSON object should return a 400 response with a body similar to
    
    data does not conform to provided schema: [{"path":"testInt","keyword":"type"}]
    
where the `error` returns the first instance of non-conformity with the schema

## Demo
An instance of this service may be available on [heroku] which can be used as a demo. To see the result you can use the following curl request: 

    curl -H "Accept: application/json" -H "Content-Type: application/json" --data-binary '{"$schema": "https://raw.githubusercontent.com/statuswoe/judge-jsen/master/demo/demo.schema.json", "testString": "this is a test", "testInt": 12345}' --compressed "https://judge-jsen.herokuapp.com/validate"
[heroku]: https://judge-jsen.herokuapp.com

## Notes
Currently the service only supports dereferenced JSON schemas  
This project is still in the early stages of development
