const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")

router.get('/allusers', (req, res) => {
	User.find()
	.then(users => {		
		res.json({users})
	})
	.catch(err => console.log(err))
})



module.exports = router