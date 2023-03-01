const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String, 
		required: true,
		min: 6
	},
	pic: {
		type: String,
		default: "https://res.cloudinary.com/venucoder/image/upload/v1667623232/check_xmpzbv.png"
	},	
	token: {
		type: String
	}
})

mongoose.model("User", userSchema)