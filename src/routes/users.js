const express = require('express');
const router = new express.Router();
const Joi = require('@hapi/joi');
const validation = require("../util/validation");
const message = require("../util/validation");
const userService = require("../services/users.service");
const authentication = require("../middleware/auth");

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
		request_body.role) {
		const schema = Joi.object().keys({
			firstName: Joi.string().min(3).max(25).label(message.userAuth.firstName).required().trim(),
			lastName: Joi.string().min(3).max(25).label(message.userAuth.lastName).required().trim(),
			email: Joi.string().email({ minDomainSegments: 2 }).label(message.userAuth.email).required().trim().replace(/ /g, ''),
			phoneNumber: Joi.string().min(10).max(10).label(message.userAuth.phoneNumber).required().trim().replace(/ /g, ''),
			password: Joi.string().min(6).label(message.userAuth.password).required().trim().replace(/ /g, ''),
			role: Joi.string().label(message.userAuth.role).required()
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.registration(result).then((response) => {
				res.status(response.code).json({
					success: true,
					data: {
						message: response.message
					}
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: true,
					data: {
						message: error.message
					}
				});
			});
		}).catch((validationError) => {
			res.status(400).json({
				success: false,
				data: {
					message: validationError
				}
			});
		});
	} else {
		res.status(403).json({
			success: false,
			data: {
				message: message.error.generalResponseError
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
		request_body.password &&
		request_body.role) {
		const schema = Joi.object().keys({
			email: Joi.string().email({ minDomainSegments: 2 }).label(message.userAuth.email).required().trim().replace(/ /g, ''),
			password: Joi.string().min(6).label(message.userAuth.password).required().trim().replace(/ /g, ''),
			role: Joi.string().label(message.userAuth.role).required()
		});

		validation.customValidation(request_body, schema).then((result) => {
			userService.login(result).then((response) => {
				res.status(response.code).json({
					success: true,
					data: {
						message: response.message,
						token: response.token
					}
				});
			}).catch((error) => {
				res.status(error.code).json({
					success: true,
					data: {
						message: error.message
					}
				});
			});
		}).catch((validationError) => {
			res.status(400).json({
				success: false,
				data: {
					message: validationError
				}
			});
		});
	} else {
		res.status(403).json({
			success: false,
			data: {
				message: message.generalResponseError
			}
		});
	}
});

module.exports = router;