const express = require('express');
const router = new express.Router();
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongodb = require("mongodb");

const validation = require("../util/validation");
const validationMessage = require("../util/messages/validationMessages");
const errorMessage = require("../util/messages/errorMessages");
const ststusCode = require("../util/messages/statusCode");

const auth = require("../middleware/auth");
const userService = require("../services/users.service");

/**
 * Users registration
 */

router.post("/registration", (req, res) => {
	const request_body = req.body;

	if (request_body.firstName &&
		request_body.lastName &&
		request_body.email &&
		request_body.phoneNumber &&
		request_body.password &&
		request_body.type) {
		const schema = Joi.object().keys({
			firstName: Joi.string().min(validationMessage.firstName.min).max(validationMessage.firstName.max).label(validationMessage.firstName.message).required().trim(),
			lastName: Joi.string().min(validationMessage.lastName.min).max(validationMessage.lastName.max).label(validationMessage.lastName.message).required().trim(),
			email: Joi.string().email({ minDomainSegments: 2 }).label(validationMessage.email).required().trim().replace(/ /g, ''),
			phoneNumber: Joi.string().min(validationMessage.phoneNumber.min).max(validationMessage.phoneNumber.max).label(validationMessage.phoneNumber.message).required().trim().replace(/ /g, ''),
			password: Joi.string().min(validationMessage.password.min).label(validationMessage.password.message).required().trim().replace(/ /g, ''),
			type: Joi.string().min(validationMessage.type.min).max(validationMessage.type.max).label(validationMessage.type.message).required()
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.registration(result).then((response) => {
				res.status(ststusCode.success.created).json({
					success: true,
					data: {
						message: response.message
					}
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		}).catch((error) => {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: error
				}
			});
		});
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.userRegistration.validation.message
			}
		});
	}
});

/**
 * User login
 */

router.post("/login", (req, res) => {
	const request_body = req.body;

	if (request_body.email &&
		request_body.password) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).label(validationMessage.email).required().trim().replace(/ /g, ''),
			password: Joi.string().min(validationMessage.password.min).label(validationMessage.password.message).required().trim().replace(/ /g, '')
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.login(result).then((response) => {
				res.status(response.code).json({
					success: true,
					message: response.message,
					userDetails: response.userDetails
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		}).catch((error) => {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: error
				}
			});
		});
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.userLogin.validation.message
			}
		});
	}
});

/**
 * Send Otp
 */

router.post("/sendOtp", auth, function (req, res) {
	const request_body = req.body;

	if (request_body.email) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).label(validationMessage.email).required().trim().replace(/ /g, '')
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.sendOtp(result).then((response) => {
				res.status(response.code).json({
					success: true,
					message: response.message,
					otp: response.otp
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		}).catch((error) => {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: error
				}
			});
		});
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.sendOtp.validation.message
			}
		});
	}
});

/**
 * Change password
 */

router.post("/changePassword", auth, function (req, res) {
	const request_body = req.body;

	if (request_body.email &&
		request_body.otp &&
		request_body.password) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).label(validationMessage.email).required().trim().replace(/ /g, ''),
			otp: Joi.string().min(validationMessage.otp.min).max(validationMessage.otp.max).label(validationMessage.otp.message).required(),
			password: Joi.string().min(validationMessage.password.min).label(validationMessage.password.message).required().trim().replace(/ /g, '')
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.changePassword(result).then((response) => {
				res.status(response.code).json({
					success: true,
					message: response.message
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		}).catch((error) => {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: error
				}
			});
		});
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.sendOtp.validation.message
			}
		});
	}
});

/**
 * Get user by id
 */

router.get("/getUserById/:id", auth, function (req, res) {
	const userId = req.params.id;

	if (userId) {
		const isValid = mongodb.ObjectID.isValid(userId);
		if (isValid) {
			userService.getUserById(userId).then((response) => {
				res.status(response.code).json({
					success: true,
					message: response.message,
					userDetails: response.details
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		} else {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: validationMessage.userId.message
				}
			});
		}
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.getUserDetails.validation.message
			}
		});
	}
});

/**
 * Update user details
 */

router.put("/updateUserDetails", auth, function (req, res) {
	const request_body = req.body;

	if (request_body.userId) {
		const isValid = mongodb.ObjectID.isValid(request_body.userId);
		if (isValid) {
			userService.updateUserDetails(request_body).then((response) => {
				res.status(response.code).json({
					success: true,
					message: response.message
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: false,
					data: {
						message: error.message
					}
				});
			});
		} else {
			res.status(ststusCode.error.validation).json({
				success: false,
				data: {
					message: validationMessage.userId.message
				}
			});
		}
	} else {
		res.status(ststusCode.error.validation).json({
			success: false,
			data: {
				message: errorMessage.updateUserDetails.validation.message
			}
		});
	}
});


module.exports = router;