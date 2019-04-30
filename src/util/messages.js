module.exports = {
	authToken: {
		keyName: "doctor_$*booking_)"
	},
	tokenError: {
		tokenExpirationError: {
			code: 401,
			message: "Auth token expired"
		}
	},
	generalResponseError: "All fileds are required",
	userAuth: {
		firstName: "Firstname should be within 3 to 25 characters long",
		lastName: "Lastname should be within 3 to 25 characters long",
		email: "Invalid email",
		phoneNumber: "Phone number should be 10 digit long",
		password: "Password should be minimum 6 characters long",
		role: "Role is required",
		registration: {
			success: {
				code: 200,
				message: "User registration successfully"
			},
			emailExist: {
				code: 404,
				message: "Email already exist",
			},
			serverError: {
				code: 500,
				message: "Internal server error"
			},
			authenticationError: {
				code: 401,
				message: "Authentication Error"
			}
		},
		login: {
			success: {
				code: 200,
				message: "Login successfully"
			},
			serverError: {
				code: 500,
				message: "Internal server error"
			},
			loginFailed: {
				code: 404,
				message: "Login failed, Please try again"
			},
			userNotFound: {
				code: 404,
				message: "Please provide correct email address"
			},
			emailPasswordNotmatch: {
				code: 404,
				message: "Email and password does not match"
			}
		}
	},
};