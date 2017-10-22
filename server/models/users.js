const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

let UserSchema = new mongoose.Schema({

	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{value} is not a valid email`
		}
	},
	password: {
		type: String,
		unique: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},

		token: {
			type: String,
			required: true
		}
	}]
});

UserSchema.methods.toJSON = function() {
	let user = this;
	let userObject = user.toObject();

	return _.pick(userObject, ["_id", "email"]);
}

UserSchema.methods.generateAuthToken = function() {
	let user = this;
	let access = "auth";
	let token = jwt.sign({_id: user._id.toHexString(), access}, "res ipsa loquitur").toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
};

UserSchema.methods.removeToken = function(token) {
	let user = this;
	
	return user.update({
		$pull: {
			tokens: {token}
		}
	});
}

UserSchema.statics.findByCredentials = function(email, password) {
	let User = this;
	//let hash = "$2a$10$FJFxinXf5ldDhVyRNfZY4.HuHOFgUe2IHPzNppVs.UPcNOhsjjAHG";
	//let plainHash = hash.toString();

	return User.findOne({email}).then((user) => {
		if(!user) {
			return Promise.reject();
		}else {
			let hash = user.password;

			/*bcrypt.compare(password, hash).then((result) => {
				console.log(result);
				if(result) {
					return user;
				}else {
					return Promise.reject();
				}
			}).catch((e) => res.status(400).send());*/

			return new Promise((resolve, reject) => {
				bcrypt.compare(password, hash, (err, result) => {
					if(result){
						resolve(user);
					}else {
						console.log("error finding match");
						reject();
					}
				});
			});
		} //Closing bracket for the higher else statement
	});
};

UserSchema.statics.findByToken = function(token) {
	console.log("Token from UserSchema ", token);
	let User = this;
	let decoded;

	try{
		decoded = jwt.verify(token, "res ipsa loquitur");
		console.log("Decoded ", decoded);
	} catch(e) {

		/*return new Promise((resolve, reject) => {
			reject();
		});*/

		return Promise.reject();
	}

	return User.findOne({
		"_id": decoded._id,
		"tokens.token": token,
		"tokens.access": "auth"
	});
};

UserSchema.pre("save", function(next) {
	let user = this;

	if(user.isModified("password")) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {

				user.password = hash;
				next();
			});
		});
	}else {
		next();
	}
});

let User = mongoose.model("User", UserSchema);

module.exports = {
	User
};