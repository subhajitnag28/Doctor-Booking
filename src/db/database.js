const mongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/config");

const connectionUri = [
	"mongodb://" + dbConfig.mongodb.host + ":" + dbConfig.mongodb.port + "/" + dbConfig.mongodb.dbName
].join("");

let connection = null;

module.exports.mongoClient = mongoClient.connect(connectionUri, function (error, client) {
	if (error) {
		console.log('Connection with mongoDb failed');
		process.exit(1);
	} else {
		connection = client;
		console.log('Connected with mongoDb...');
	}
});

module.exports.get = function () {
	return connection;
}