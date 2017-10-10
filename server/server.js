const express = require("express");
const bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todos");
const {User} = require("./models/users");

const app = express();
const port = process.env.PORT || 3000;

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
		if(!allTodos) {
			return res.status(400).send(allTodos);
		}
		console.log(allTodos[0]._id);
		res.send({allTodos});
	}, err => {
		response.status(400).send(err);
	}).catch((e) => res.status(400).send(e));
});

app.get("/todos/:id", (req,res) => {
	let id = req.params.id;
	console.log("ID from server.test.js ", id);
	if(!ObjectID.isValid(id)) {
		res.status(404).send("Not found--Invalid Id.");
		return;
	}

	Todo.findById({_id: id}).then((item) => {
		if(!item) {
			return res.status(404).send("Todo item not found in database.");
		}
			console.log(item);
			res.status(200).send({item});
	}).catch((e) => res.status(400).send(e));
});

app.listen(port, () => {
	console.log(`Server listening on ${port}...`);
});

module.exports = {app};