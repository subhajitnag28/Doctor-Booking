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
	},
	sendOtp: {
		success: {
			code: statusCode.success.ok,
			message: "Otp send successfully"
		}
	},
	changePassword: {
		success: {
			code: statusCode.success.ok,
			message: "Passsword change successfully"
		}
	},
	getUserDetails: {
		success: {
			code: statusCode.success.ok,
			message: "User details"
		}
	}
};