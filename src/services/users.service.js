const db = require("../db/database");
const salt = require("../util/salt");

const errorMessage = require("../util/messages/errorMessages");
const successMessage = require("../util/messages/successMessages");

class UserService {

	/**
	 * User registration
	 */
	registration(value) {
		return new Promise(function (resolve, reject) {
			const data = value;
			const { email, password } = value;
			const user = db.get().collection('user');

			user.find({ email: email }).toArray(function (error, result) {
				if (error) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					if (result.length != 0) {
						reject({
							code: errorMessage.userRegistration.emailExist.code,
							message: errorMessage.userRegistration.emailExist.message
						});
					} else {
						const saltedPassword = salt.saltHashPassword(password);
						data.saltKey = saltedPassword.salt;
						data.salt = saltedPassword.passwordHash;
						data.createdTime = new Date().getTime();
						data.referalCode = Math.random().toString(25).substring(7);
						delete data.password;

						user.save(data, function (error1, userRes) {
							if (error1) {
								reject({
									code: errorMessage.general.internalServer.code,
									message: errorMessage.general.internalServer.message
								});
							} else {
								if (userRes.ops.length != 0) {
									resolve({
										code: successMessage.userRegistration.created.code,
										message: successMessage.userRegistration.created.message
									});
								}
							}
						});
					}
				}
			});
		});
	}

	/**
	 * User login
	 */
	login(value) {
		return new Promise(function (resolve, reject) {
			const { email, password } = value;
			const user = db.get().collection('user');

			user.find({ email: email }).toArray((function (error, result) {
				if (error) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					if (result.length != 0) {
						const userData = result[0];
						const decryptedPassword = salt.getPasswordFromHash(userData.saltKey, password);
						if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
							user.findOneAndUpdate(userData._id, { $set: userData }, function (err, userDetails) {
								if (err) {
									reject({
										code: errorMessage.general.internalServer.code,
										message: errorMessage.general.internalServer.message
									});
								} else {
									const details = userDetails.value;
									details.loginTime = new Date().getTime();
									delete details._id;
									delete details.saltKey;
									delete details.salt;
									delete details.createdTime;
									resolve({
										code: successMessage.userLogin.success.code,
										message: successMessage.userLogin.success.message,
										userDetails: details
									});
								}
							});
						} else {
							reject({
								code: errorMessage.userLogin.emailPassIncorrect.code,
								message: errorMessage.userLogin.emailPassIncorrect.message
							});
						}
					} else {
						reject({
							code: errorMessage.userLogin.notFound.code,
							message: errorMessage.userLogin.notFound.message
						});
					}
				}
			}));
		});
	}

	/**
	 * send otp
	 */
	sendOtp(value) {
		return new Promise(function (resolve, reject) {
			const { email } = value;
			const user = db.get().collection('user');

			user.find({ email: email }).toArray((function (error, result) {
				if (error) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					console.log(result);
				}
			}));
		});
	}
}

module.exports = new UserService();