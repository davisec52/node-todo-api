require("../.config/.config");
const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const {ObjectID} = require("mongodb");
const {mongoose} = require("./db/mongoose");
const {Todo} = require("./models/todos");
const {User} = require("./models/users");
const {authenticate} = require("./middleware/authenticate");

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post("/todos", authenticate, (req, res) => {
	let newItem = new Todo({
		_creator: req.user._id,
		text: req.body.text
	});

	newItem.save().then((doc) => {
		res.send(doc);
	}, err => {
		res.status(400).send(err);
		return;
	});
});

app.get("/todos", authenticate, (req, res) => {
	Todo.find({_creator: req.user._id}).then((allTodos) => {
		if(!allTodos) {
			return res.status(400).send({allTodos});
		}
		res.send({allTodos});
	}, err => {
		response.status(400).send(err);
	}).catch((e) => res.status(400).send(e));
});

app.get("/todos/:id", authenticate, (req,res) => {
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		res.status(404).send("Not found--Invalid Id.");
		return;
	}

	Todo.findOne({_id: id, _creator: req.user._id}).then((item) => {
		if(!item) {
			return res.status(404).send("Todo item not found in database.");
		}
			res.status(200).send({item});
	}).catch((e) => res.status(400).send(e));
});

app.delete("/todos/:id", authenticate, (req, res) => {
	let id = req.params.id;
	if(!ObjectID.isValid(id)) {
		return res.status(404).send("Record not found-unable to delete-invalid Id.");
	}

	Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
		if(!todo) {
			return res.status(404).send("No such record");
		}
		res.status(202).send({todo});
	}).catch((e) => res.status(400).send());
});

app.patch("/todos/:id", authenticate, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body, ["text", "completed"]);

	if(!ObjectID.isValid(id)) {
		return res.status(404).send("Not found--Invalid Id.");
	}

	if(_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	}else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
		if(!todo) {
			res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.get("/users/me", authenticate, (req,res) => {
	res.send(req.user);
});

// POST todos/users

app.post("/users", (req, res) => {
	let body = _.pick(req.body, ["email", "password"]);
	
	let newUser = new User({
		email: body.email,
		password: body.password
	});

	newUser.save().then(() => {
		return newUser.generateAuthToken();
	}).then((token) => {
		res.header("x-auth", token).send(newUser);
	}).catch((e) => res.status(400).send(e));
});

app.post("/users/login", (req, res, next) => {
	//let email = req.body.email;
	//let password = req.body.password;

	let body = _.pick(req.body, "email", "password");

	User.findByCredentials(body.email, body.password).then((user) => {
		user.generateAuthToken().then((token) => {
			res.header("x-auth", token).send(user);
		});
	}).catch((e) => res.status(400).send({error: "Bad request or failure to find match"}));

});

app.delete("/users/me/token", authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Server listening on ${port}...`);
});

module.exports = {app};