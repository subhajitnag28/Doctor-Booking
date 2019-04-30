const jwt = require('jsonwebtoken');
const message = require("../util/messages");

const auth = (req, res, next) => {
	// try {
	// 	const token = req.header('Authorization').replace('Bearer ', '');
	// 	const decoded = jwt.verify(token, message.authToken.keyName);
	// 	next();
	// } catch (e) {
	// 	res.status(message.tokenError.tokenExpirationError.code).json({
	// 		success: false,
	// 		data: {
	// 			message: message.tokenError.tokenExpirationError.message
	// 		}
	// 	});
	// }

	const token = req.header('Authorization').replace('Bearer ', '');
	const decoded = jwt.verify(token, message.authToken.keyName);
	console.log(decoded);
}

module.exports = auth;