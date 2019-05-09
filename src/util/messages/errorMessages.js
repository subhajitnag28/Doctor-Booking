const statusCode = require("./statusCode");

module.exports = {
	general: {
		internalServerError: { code: statusCode.error.internalServerError, message: "Internal server error" },
		unauthorized: { code: statusCode.error.unauthorized, message: "User unauthorized" },
		userNotFound: { code: statusCode.error.notFound, message: "User not found" }
	},
	userRegistration: {
		validation: { code: statusCode.error.validation, message: "First name, last name, email, phone number, password and Type are required" },
		emailExist: { code: statusCode.error.notFound, message: "Email already exist" }
	},
	userLogin: {
		validation: { code: statusCode.error.validation, message: "Email and password are required" },
		emailPassWordIncorrect: { code: statusCode.error.notFound, message: "Email or password does not match" }
	},
	sendOtp: {
		validation: { code: statusCode.error.validation, message: "Email is required" }
	},
	changePassword: {
		validation: { code: statusCode.error.validation, message: "Otp and password are required" },
		otpNotMatch: { code: statusCode.error.notFound, message: "Otp does not match" }
	},
	getUserDetails: {
		validation: { code: statusCode.error.validation, message: "User id is required" }
	}
};