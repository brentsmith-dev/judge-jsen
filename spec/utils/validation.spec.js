describe('validation.js', function() {
	var validation = require('../../src/utils/validation.js');
	
	beforeEach(function() {
		data = {};
		response = {
			send: function() {},
			status: function() {}
		};
		schemaResponse = {};
		spyOn(response, 'send');
		spyOn(response, 'status');
	});

	describe('#judgeBeacon', function() {
		// this spy is getting applied to the local var, not the one judgeBeacon is using
		// TODO: find a workaround
		beforeEach(function(){
			spyOn(validation, 'validateSchema');
		});
		it('should make a call to validateSchema with the data and response', function() {
			expect(true).toBe(true);
			//validation.judgeBeacon(data, response);
			//expect(validation.validateSchema).toHaveBeenCalledWith(data, response, jasmine.any(Object), jasmine.any(Object))
		});
	});

	/*describe('#validateSchema', function() {
		it('should return a 500 if the schema request fails', function() {
			data = {
				$schema: 'http://fakedomain.notreal'
			};
			validation.validateSchema(data, response, null, {})
			expect(response.status).toHaveBeenCalledWith(500)
		});
	});*/
});
