require("../.config/.config")
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todos");
const {User} = require("./models/users");

const app = express();
const port = process.env.PORT;

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
			return res.status(400).send({allTodos});
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

app.delete("/todos/:id", (req, res) => {
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("Record not found-unable to delete-invalid Id.");
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			return res.status(404).send("No such record");
		}
		res.status(202).send({todo});
	}).catch((e) => res.status(400).send());
});

app.patch("/todos/:id", (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["text", "completed"]);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send("Not found--Invalid Id.");
	}

	if(_.isBoolean(body.completed) && body.completed) {
		console.log("body ", body)
		body.completedAt = new Date().getTime();
	}else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		console.log("UPDATED TODO ", todo);
		if(!todo) {
			res.status(400).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

// POST todos/users

app.post("/users", (req, res) => {
	let body = _.pick(req.body, ["email", "password"]);
	console.log("body ", body);
	let newUser = new User({
		email: body.email,
		password: body.password
	});
	newUser.save().then((user) =>{
		res.send(user);
	}, err => {res.status(400).send(err);});
});

// Code copied from course resource file
/*app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});*/

app.listen(port, () => {
	console.log(`Server listening on ${port}...`);
});

module.exports = {app};