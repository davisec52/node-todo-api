const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");
const {Todo} = require("./../../models/todos");
const {User} = require("./../../models/users");

let userOneId = new ObjectID();
let userTwoId = new ObjectID();

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
	password: "userTwoPass"
}];

const todos = [
	{
		"text": "Rescue neighbor from Jocie",
		"_id": new ObjectID()
	},
	
	{
		"text": "Teach Caleb Zen of tennis balls",
		"_id": new ObjectID(),
		"completed": true,
		"completedAt": 1234
	},
	
	{
		"text": "Kill the landlord",
		"_id": new ObjectID()
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