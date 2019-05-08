const statusCode = require("./statusCode");

module.exports = {
	userRegistration: {
		created: {
			code: statusCode.success.created,
			message: "User registration successfully"
		}
	},
	userLogin: {
		success: {
			code: statusCode.success.ok,
			message: "User login successfully"
		}
	}
};