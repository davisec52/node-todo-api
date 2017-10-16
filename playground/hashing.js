const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

let data = {
	id: 42
};

let token = jwt.sign(data, "...and the terrors are many");

let decoded = jwt.verify(token, "...and the terrors are many");

console.log("decoded ", decoded);




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