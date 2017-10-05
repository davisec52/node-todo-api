//const MongoClient = require("mongodb").MongoClient;

const {MongoClient, ObjectID} = require("mongodb");

let obj = new ObjectID();

console.log(obj.getTimestamp());

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if(err) {
		return console.log("Unable to connect to mongodb: ", err);
	}
	console.log("Connected to mongodb");

	/*db.collection("Todos").insertOne({
		text: "Something important for canines.",
		completed: false
	}, (err, result) => {
		if(err) {
			console.log("Unable to insert item: ", err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));
	});*/

	/*db.collection("Users").insertOne({
		_id: "poiuyt",
		name: "Freckles",
		age: 2,
		location: "Iowa City"
	}, (err, result) => {
		if(err) {
			console.log("Unable to insert user: ", err);
		}
		console.log(JSON.stringify(result.ops, undefined, 2));
	});*/

	db.close();
});