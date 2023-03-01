const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const placeSchema = new mongoose.Schema({
	sight: {
		type: String,
		required: true
	},
	city: {
		type: String, 
		required: true
	},
	province: {
		type: String, 
		required: true	
	},
	country: {
		type: String, 
		required: true
	},
	cost: {
		type: String, 
		required: true
	},
	photo: {
		type:String, 
		required:true
	},
	comments: [{
		text: String,
		rating: Number,
		postedBy: {type: ObjectId, ref: "User"}
	}],	
	likes: [{type: ObjectId, ref: "User"}],
	images: [{type: String}],
	postedBy: {type: ObjectId, ref: "User"}
})

mongoose.model("Place", placeSchema)