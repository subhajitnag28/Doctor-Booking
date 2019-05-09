const db = require("../db/database");
const errorMessage = require("../util/messages/errorMessages");

const auth = async (req, res, next) => {
	const token = req.header('Authorization').replace('Bearer ', '');
	req.header('Time');
	const user = db.get().collection('user');

	user.find({ "token.value": token, "token.expiration": { $gte: new Date().getTime() } }).toArray(function (err, result) {
		if (err) {
			res.status(errorMessage.general.internalServerError.code).json({
				success: false,
				data: {
					message: errorMessage.general.internalServerError.code.message
				}
			});
		} else {
			if (result.length != 0) {
				const userDetails = result[0];
				userDetails.token.expiration = new Date().setMinutes(new Date().getMinutes() + 45);

				user.update({
					email: userDetails.email
				}, {
						$set: userDetails
					}, {
						upsert: true
					}, function (err1, details) {
						if (err1) {
							res.status(errorMessage.general.internalServerError.code).json({
								success: false,
								data: {
									message: errorMessage.general.internalServerError.code.message
								}
							});
						} else {
							next();
						}
					});
			} else {
				res.status(errorMessage.unauthorized.code).json({
					success: false,
					code: errorMessage.unauthorized.code,
					data: {
						message: errorMessage.unauthorized.message
					}
				});
			}
		}
	});

}

module.exports = auth;