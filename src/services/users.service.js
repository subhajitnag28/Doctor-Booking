const db = require("../db/database");
const salt = require("../../util/salt");
const message = require("../../util/messages");
const authToken = require("../../util/authToken");

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
						code: message.userAuth.registration.serverError.code,
						message: message.userAuth.registration.serverError.message
					});
				} else {
					if (result.length != 0) {
						reject({
							code: message.userAuth.registration.emailExist.code,
							message: message.userAuth.registration.emailExist.message
						});
					} else {
						const saltedPassword = salt.saltHashPassword(password);
						data.saltKey = saltedPassword.salt;
						data.salt = saltedPassword.passwordHash;
						delete data.password;

						user.save(data, function (error1, userRes) {
							if (error1) {
								reject({
									code: message.userAuth.registration.serverError.code,
									message: message.userAuth.registration.serverError.message
								});
							} else {
								if (userRes.ops.length != 0) {
									resolve({
										code: message.userAuth.registration.success.code,
										message: message.userAuth.registration.success.message,
										token: userRes.ops[0].token
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
			const data = value;
			const { email, password, role } = value;
			const user = db.get().collection('user');

			user.find({ email: email, role: role }).toArray((function (error, result) {
				if (error) {
					reject({
						code: message.userAuth.login.serverError.code,
						message: message.userAuth.login.serverError.message
					});
				} else {
					if (result.length != 0) {
						const userData = result[0];
						const decryptedPassword = salt.getPasswordFromHash(userData.saltKey, password);
						if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
							const token = authToken.generateAuthToken(email);
							if (token) {
								userData.token = token;
								user.findOneAndUpdate(userData._id, { $set: userData }, function (err, userDetails) {
									if (err) {
										reject({
											code: message.userAuth.login.loginFailed.code,
											message: message.userAuth.login.loginFailed.message
										});
									} else {
										resolve({
											code: message.userAuth.login.success.code,
											message: message.userAuth.login.success.message,
											token: token
										});
									}
								});
							}
						} else {
							reject({
								code: message.userAuth.login.emailPasswordNotmatch.code,
								message: message.userAuth.login.emailPasswordNotmatch.message
							});
						}
					} else {
						reject({
							code: message.userAuth.login.userNotFound.code,
							message: message.userAuth.login.userNotFound.message
						});
					}
				}
			}));
		});
	}
}

module.exports = new UserService();