const express = require("express");
const bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
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
		res.status(400).send(err);
		return;
	});
});

app.get("/todos", (req, res) => {
	Todo.find().then((allTodos) => {
		res.send({allTodos});
	}, err => {
		response.status(400).send(err);
	});
});

app.get("/todos/:id", (req,res) => {
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		res.status(404).send("Not found--Invalid Id.");
		return;
	}

	Todo.findById({_id: id}).then((item) => {
		if(!item) {
			res.status(404).send("Todo item not found in database.");
		}else {
			res.status(200).send(item);
		}
		
	}, err => {response.status(400).send(err)});
});

app.listen(3000, () => {
	console.log("Server listening on 3000...");
});

module.exports = {app};