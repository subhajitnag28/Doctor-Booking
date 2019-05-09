const mongodb = require("mongodb");

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
			const user = db.get().collection('user');

			user.find({ email: data.email }).toArray(function (error, result) {
				if (error) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (result.length != 0) {
						reject({ code: errorMessage.userRegistration.emailExist.code, message: errorMessage.userRegistration.emailExist.message });
					} else {
						const saltedPassword = salt.saltHashPassword(data.password);
						data.saltKey = saltedPassword.salt;
						data.salt = saltedPassword.passwordHash;
						data.createdTime = new Date().getTime();
						data.referalCode = Math.random().toString(25).substring(7);
						delete data.password;

						user.save(data, function (error1, userRes) {
							if (error1) {
								reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
							} else {
								if (userRes.ops.length != 0) {
									resolve({ code: successMessage.userRegistration.created.code, message: successMessage.userRegistration.created.message });
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
			const user = db.get().collection('user');

			user.find({ email: data.email }).toArray((function (error, result) {
				if (error) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (result.length != 0) {
						const userData = result[0];
						userData.token = { value: Math.random().toString(12).substr(5), expiration: new Date().setMinutes(new Date().getMinutes() + 45) };
						const decryptedPassword = salt.getPasswordFromHash(userData.saltKey, data.password);
						if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
							user.findOneAndUpdate(userData._id, { $set: userData }, function (err, userDetails) {
								if (err) {
									reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
								} else {
									const details = userDetails.value;
									details.loginTime = new Date().getTime();
									delete details._id;
									delete details.saltKey;
									delete details.salt;
									delete details.createdTime;

									resolve({ code: successMessage.userLogin.success.code, message: successMessage.userLogin.success.message, userDetails: details });
								}
							});
						} else {
							reject({ code: errorMessage.userLogin.emailPassWordIncorrect.code, message: errorMessage.userLogin.emailPassWordIncorrect.message });
						}
					} else {
						reject({ code: errorMessage.general.userNotFound.code, message: errorMessage.general.userNotFound.message });
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
			const data = value;
			const user = db.get().collection('user');
			const userTemp = db.get().collection('userTemp');

			user.find({ email: data.email }).toArray((function (error, result) {
				if (error) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (result.length != 0) {
						const otp = Math.floor(100000 + Math.random() * 900000);

						userTemp.find({ email: data.email }).toArray(function (err1, docs) {
							if (err1) {
								reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
							} else {
								if (docs.length != 0) {
									userTemp.remove((function (err2, docs1) {
										if (err2) {
											reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
										} else {
											userTemp.save({ email: data.email, otp: otp }, function (err3, docs3) {
												if (err3) {
													reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
												} else {
													resolve({ code: successMessage.sendOtp.success.code, message: successMessage.sendOtp.success.message, otp: docs3.ops[0].otp });
												}
											});
										}
									}));
								} else {
									userTemp.save({ email: data.email, otp: otp }, function (err4, docs4) {
										if (err4) {
											reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
										} else {
											resolve({ code: successMessage.sendOtp.success.code, message: successMessage.sendOtp.success.message, otp: docs4.ops[0].otp });
										}
									});
								}
							}
						});
					} else {
						reject({ code: errorMessage.general.userNotFound.code, message: errorMessage.general.userNotFound.message });
					}
				}
			}));
		});
	}

	/**
	 * Verify otp
	 */

	changePassword(value) {
		return new Promise(function (resolve, reject) {
			const data = value;
			const user = db.get().collection('user');
			const userTemp = db.get().collection('userTemp');

			userTemp.find({ email: data.email }).toArray(function (err, res1) {
				if (err) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (res1.length != 0) {
						if (res1[0].otp == data.otp) {
							const saltedPassword = salt.saltHashPassword(data.password);

							const saltKey = saltedPassword.salt;
							const newSalt = saltedPassword.passwordHash;

							user.update({
								email: data.email
							}, {
									$set: {
										saltKey: saltKey,
										salt: newSalt
									}
								}, {
									upsert: true
								},
								function (err2, res2) {
									if (err2) {
										reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
									} else {
										userTemp.remove({ _id: mongodb.ObjectID(res1[0]._id) }, function (err5, res5) {
											if (err5) {
												reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
											}
											else {
												resolve({ code: successMessage.changePassword.success.code, message: successMessage.changePassword.success.message });
											}
										});
									}
								});
						} else {
							reject({ code: errorMessage.changePassword.otpNotMatch.code, message: errorMessage.changePassword.otpNotMatch.message });
						}
					} else {
						reject({ code: errorMessage.general.userNotFound.code, message: errorMessage.general.userNotFound.message });
					}
				}
			});
		});
	}

	/**
	 * Get user by id
	 */

	getUserById(value) {
		return new Promise(function (resolve, reject) {
			const id = value;

			const user = db.get().collection('user');
			user.find({ _id: mongodb.ObjectID(id) }).toArray(function (err, result) {
				if (err) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (result.length != 0) {
						const userDetails = result[0];
						delete userDetails._id;
						delete userDetails.salt;
						delete userDetails.saltKey;
						delete userDetails.createdTime;

						resolve({ code: successMessage.getUserDetails.success.code, message: successMessage.getUserDetails.success.message, details: userDetails });
					} else {
						reject({ code: errorMessage.general.userNotFound.code, message: errorMessage.general.userNotFound.message });
					}
				}
			});
		});
	}

	/**
	 * Update user details
	 */
	updateUserDetails(value) {
		return new Promise(function (resolve, reject) {
			const data = value;
			const user = db.get().collection('user');

			user.find({ email: data.email }).toArray(function (err, result) {
				if (err) {
					reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
				} else {
					if (result.length != 0) {
						user.update({
							email: data.email
						}, {
								$set: data
							}, {
								upsert: true
							}, function (err2, details) {
								if (err2) {
									reject({ code: errorMessage.general.internalServerError.code, message: errorMessage.general.internalServerError.message });
								} else {
									resolve({ code: successMessage.updateUserDetails.success.code, message: successMessage.updateUserDetails.success.message });
								}
							});
					} else {
						reject({ code: errorMessage.general.userNotFound.code, message: errorMessage.general.userNotFound.message });
					}
				}
			});
		});
	}
}

module.exports = new UserService();