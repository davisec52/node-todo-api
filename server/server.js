const express = require("express");
const bodyParser = require("body-parser");

const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todos");
const {User} = require("./models/users");

let app = express();

app.use(bodyParser.json());

app.post("/todos", (req, res) => {
	let newItem = new Todo({
		text: req.body.text
	});

	newItem.save().then((doc) => {
		res.send(doc);
	}, err => {
		console.log("Unable to save todo ", err);
	});
});

app.listen(3000, () => {
	console.log("Server listening on 3000...");
});