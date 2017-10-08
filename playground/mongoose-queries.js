const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todos");
const {User} = require("./../server/models/users");

//let id = "59d941094e70e2f92f5b9ab4aaa";
let id = "59d6993dbe6cf1f85dd609dc";

if(!ObjectID.isValid(id)) {
	console.log("Invalid Id");
}else {console.log("Id valid");}

/*Todo.find({
	_id: id
	//completed: false
}).then((todos) => {
	console.log("Todos ", todos);
});

Todo.findOne({
	_id: id
}).then((todo) => {
	if(!todo) {
		console.log("Todo not found");
	}else {console.log("Todo ", todo);}
});

Todo.findById(id).then((todo) => {
	if(!todo) {
		console.log("Todo not found");
	}else {console.log("Todo by id ", todo);}
}).catch((e) => {console.log(e);});*/

User.find({
	_id: id
	//completed: false
}).then((users) => {
	console.log("Users ", users);
});

User.findOne({
	_id: id
}).then((user) => {
	if(!user) {
		console.log("User not found");
	}else {console.log("User ", user);}
});

User.findById(id).then((user) => {
	if(!user) {
		console.log("User not found");
	}else {console.log("User by id ", user);}
}).catch((e) => {console.log(e);});