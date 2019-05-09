const statusCode = require("./statusCode");

module.exports = {
	general: {
		internalServer: {
			code: statusCode.error.internalServer,
			message: "Internal server error"
		},
		unauthorized: {
			code: statusCode.error.unauthorized,
			message: "User unauthorized"
		}
	},
	userRegistration: {
		validation: {
			code: statusCode.error.validation,
			message: "First name, last name, email, phone number, password and Type are required"
		},
		notFound: {
			code: statusCode.error.notFound,
			message: "User not found"
		},
		emailExist: {
			code: statusCode.error.notFound,
			message: "Email already exist"
		}
	},
	userLogin: {
		validation: {
			code: statusCode.error.validation,
			message: "Email and password are required"
		},
		notFound: {
			code: statusCode.error.notFound,
			message: "User not found"
		},
		emailPassIncorrect: {
			code: statusCode.error.notFound,
			message: "Email or password does not match"
		}
	},
	sendOtp: {
		validation: {
			code: statusCode.error.validation,
			message: "Email is required"
		},
		notFound: {
			code: statusCode.error.notFound,
			message: "User not found"
		}
	},
	changePassword: {
		validation: {
			code: statusCode.error.validation,
			message: "Otp and password are required"
		},
		notFound: {
			code: statusCode.error.notFound,
			message: "User not found"
		},
		otpNotMatch: {
			code: statusCode.error.notFound,
			message: "Otp does not match"
		}
	},
	getUserDetails: {
		validation: {
			code: statusCode.error.validation,
			message: "User id is required"
		},
		notFound: {
			code: statusCode.error.notFound,
			message: "User not found"
		}
	}
};