const mongoClient = require("mongodb").MongoClient;
const dbConfig = require("../config/config");

const connectionUri = [
	"mongodb://" + dbConfig.mongo.host + ":" + dbConfig.mongo.port + "/" + dbConfig.mongo.dbName
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