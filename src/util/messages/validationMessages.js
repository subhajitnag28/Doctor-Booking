module.exports = {
	firstName: {
		min: 3, max: 25, message: "Firstname should be within 3 to 25 characters long"
	},
	lastName: {
		min: 3, max: 25, message: "Lastname should be within 3 to 25 characters long"
	},
	email: "Invalid email",
	phoneNumber: {
		min: 10, max: 10, message: "Phone number should be 10 digit long"
	},
	password: { min: 6, message: "Password should be minimum 6 characters long" },
	type: { min: 4, max: 6, message: "Type is required" },
	otp: { min: 6, max: 6, message: "Otp should be 6 digit long" },
	userId: { message: "Please provide a valid user id" }
};