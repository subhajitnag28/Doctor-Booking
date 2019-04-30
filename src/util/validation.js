const Joi = require('@hapi/joi');

module.exports.customValidation = function (request_body, schema) {
	return new Promise(function (resolve, reject) {
		Joi.validate(request_body, schema, function (err, value) {
			if (err) {
				reject(err.details[0].context.label);
			} else {
				resolve(value);
			}
		});
	});
}