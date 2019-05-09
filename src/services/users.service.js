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
			const userTemp = db.get().collection('userTemp');

			user.find({ email: email }).toArray((function (error, result) {
				if (error) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					if (result.length != 0) {
						const otp = Math.floor(100000 + Math.random() * 900000);

						userTemp.find({
							email: email
						}).toArray(function (err1, docs) {
							if (err1) {
								reject({
									code: errorMessage.general.internalServer.code,
									message: errorMessage.general.internalServer.message
								});
							} else {
								if (docs.length != 0) {
									userTemp.remove((function (err2, docs1) {
										if (err2) {
											reject({
												code: errorMessage.general.internalServer.code,
												message: errorMessage.general.internalServer.message
											});
										} else {
											userTemp.save({
												email: email,
												otp: otp
											}, function (err3, docs3) {
												if (err3) {
													reject({
														code: errorMessage.general.internalServer.code,
														message: errorMessage.general.internalServer.message
													});
												} else {
													resolve({
														code: successMessage.sendOtp.success.code,
														message: successMessage.sendOtp.success.message,
														otp: docs3.ops[0].otp
													});
												}
											});
										}
									}));
								} else {
									userTemp.save({
										email: email,
										otp: otp
									}, function (err4, docs4) {
										if (err4) {
											reject({
												code: errorMessage.general.internalServer.code,
												message: errorMessage.general.internalServer.message
											});
										} else {
											resolve({
												code: successMessage.sendOtp.success.code,
												message: successMessage.sendOtp.success.message,
												otp: docs4.ops[0].otp
											});
										}
									});
								}
							}
						});
					} else {
						reject({
							code: errorMessage.sendOtp.notFound.code,
							message: errorMessage.sendOtp.notFound.message
						});
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
			const { email, otp, password } = value;

			const user = db.get().collection('user');
			const userTemp = db.get().collection('userTemp');

			userTemp.find({
				email: email
			}).toArray(function (err, res1) {
				if (err) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					if (res1.length != 0) {
						if (res1[0].otp == otp) {
							const saltedPassword = salt.saltHashPassword(password);

							const saltKey = saltedPassword.salt;
							const newSalt = saltedPassword.passwordHash;

							user.update({
								email: email
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
										reject({
											code: errorMessage.general.internalServer.code,
											message: errorMessage.general.internalServer.message
										});
									} else {
										userTemp.remove({
											_id: mongodb.ObjectID(res1[0]._id)
										}, function (err5, res5) {
											if (err5) {
												reject({
													code: errorMessage.general.internalServer.code,
													message: errorMessage.general.internalServer.message
												});
											}
											else {
												resolve({
													code: successMessage.changePassword.success.code,
													message: successMessage.changePassword.success.message
												});
											}
										});
									}
								});
						} else {
							reject({
								code: errorMessage.changePassword.otpNotMatch.code,
								message: errorMessage.changePassword.otpNotMatch.message
							});
						}
					} else {
						reject({
							code: errorMessage.changePassword.notFound.code,
							message: errorMessage.changePassword.notFound.message
						});
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
			console.log(id);

			const user = db.get().collection('user');
			user.find({
				_id: mongodb.ObjectID(id)
			}).toArray(function (err, result) {
				if (err) {
					reject({
						code: errorMessage.general.internalServer.code,
						message: errorMessage.general.internalServer.message
					});
				} else {
					if (result.length != 0) {
						console.log(result);
					} else {
						reject({
							code: errorMessage.getUserDetails.notFound.code,
							message: errorMessage.getUserDetails.notFound.message
						});
					}
				}
			});
		});
	}
}

module.exports = new UserService();