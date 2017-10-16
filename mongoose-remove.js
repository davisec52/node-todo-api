const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todos");
const {User} = require("./../server/models/users");

Todo.findByIdAndRemove("59dd134d6848195c24075c79").then((todo) => {
	console.log(todo);
})