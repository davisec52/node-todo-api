//const MongoClient = require("mongodb").MongoClient;

const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if(err) {
		return console.log("Unable to connect to mongodb: ", err);
	}
	console.log("Connected to mongodb");

	/*db.collection("Todos").find({
		_id: new ObjectID("59d51b2ffd019767f591dc2a")
	}).toArray().then((docs) => {
		console.log("Todo Items");
		console.log(JSON.stringify(docs, undefined, 2));
	}, err => {
		console.log("Unable to fetch items: ", err);
	});*/

	db.collection("Users").find({name: "Evan"}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, err => {console.log(err);});

	//db.close();
});