const jwt = require("jsonwebtoken");
const message = require("./messages");

module.exports.generateAuthToken = function (email) {
	const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), email: email }, message.authToken.keyName);
	return token;
}