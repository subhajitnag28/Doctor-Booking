const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

require("./db/database");

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("tiny"));

app.use("/user", require("./routes/users"));

const port = process.env.PORT || 7000;
app.listen(port, () => {
	console.log("Server is listening on port :", port);
});