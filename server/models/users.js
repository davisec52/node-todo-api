const mongoose = require("mongoose");
const validator = require("validator");

let User = mongoose.model("User", {
	email: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: `{value} is not a valid email`
		}
	},
	password: {
		type: String,
		unique: true,
		minLength: 6
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

module.exports = {
	User
};