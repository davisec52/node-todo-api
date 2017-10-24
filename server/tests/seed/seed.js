const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");
const {Todo} = require("./../../models/todos");
const {User} = require("./../../models/users");

let userOneId = new ObjectID();
let userTwoId = new ObjectID();
let userThreeId = new ObjectID();

const users = [{
	_id: userOneId,
	email: "monkey1@dog.com",
	password: "userOnePass",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userOneId, access: "auth"}, "res ipsa loquitur").toString()
	}]
}, {
	_id: userTwoId,
	email: "monkey2@dog.com",
	password: "userTwoPass",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userTwoId, access: "auth"}, "res ipsa loquitur").toString()
	}]
}, {
	_id: userThreeId,
	email: "monkey3@dog.com",
	password: "userThreePass",
	tokens: [{
		access: "auth",
		token: jwt.sign({_id: userThreeId, access: "auth"}, "res ipsa loquitur").toString()
	}]
}];

const todos = [
	{
		"text": "Rescue neighbor from Jocie",
		"_id": new ObjectID(),
		_creator: userOneId
	},
	
	{
		"text": "Teach Caleb Zen of tennis balls",
		"_id": new ObjectID(),
		"completed": true,
		"completedAt": 1234,
		_creator: userTwoId
	},
	
	{
		"text": "Kill the landlord",
		"_id": new ObjectID(),
		_creator: userThreeId
	}
];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		let userOne = new User(users[0]).save();
		let userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo]);
	}).then(() => done());
};

module.exports = {
	todos,
	populateTodos,
	users,
	populateUsers	
};