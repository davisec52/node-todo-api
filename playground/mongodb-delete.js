const {MongoClient, ObjectID} = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if(err) {
		return console.log("Unable to connect to mongodb: ", err);
	}
	console.log("Connected to mongodb");

	/*db.collection("Todos").deleteOne({text: "Rescue neighbor from dogs"}).then((result) => {
		console.log(JSON.stringify(result.result, undefined, 2));
	});*/

	/*db.collection("Todos").findOneAndDelete({completed: false}).then((result) => {
		console.log(result);
	});*/

	/*db.collection("Users").deleteMany({name: "Evan"}).then((result) => {
		console.log(JSON.stringify(result.result, undefined, 2));
	});*/

	db.collection("Users").findOneAndDelete({_id: "poiuyt"}).then((result) => {
		console.log(result);
	});



	//db.close();
});