const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

console.log("connected to hashing.js");



let password = "password123";

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log("hashed pass ", hash);
	})
});

bcrypt.compare("password123", "$2a$10$AlKp8Kf/YitbppqBHVNDGO4P3p1o3dnMstd0jzfIsfLOy0uXdJ4ZC", (err, result) => {
	console.log(result);
});

/*let data = {
	id: 42
};

let token = jwt.sign(data, "...and the terrors are many");

let decoded = jwt.verify(token, "...and the terrors are many");

console.log("decoded ", decoded);
*/
/*let message = "je suis 42";

let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
	id: 3
};

let token = {
	data,
	hash: SHA256(JSON.stringify(data) + "feefifofum").toString()
};

let resultHash = SHA256(JSON.stringify(token.data)).toString();

if(resultHash === token.hash) {
	console.log("It's a go!")
}else {
	console.log("Security alert!");
}*/