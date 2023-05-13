const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')

router.post('/signup',  (req, res) => {	
	const {name, email, password} = req.body;	
	
	if(!name || !email || !password) {
		return res.json({err: "Please Enter All Fields"})
	}
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
	if(!strongRegex.test(password)) {
		return res.json({err: "Password should contain uppercase, lowercase, digits and special characters"})	
	}
	User.findOne({email: email})
	.then(savedUser => {
		if(savedUser){
			return res.json({err: "User Already Exists"})
		}		
		bcrypt.hash(password, 12)
		.then(hashedpassword => {
			const user = new User({
				name,
				email,
				password: hashedpassword
			})
			user.save()
			.then(user => {				
				const token = jwt.sign({user_id: user._id}, JWT_SECRET, {expiresIn: "365d"})
				user.token = token
				user.password = undefined
				res.json({user})
			})
			.catch(err => console.log(err))			
		})	
	})		
	.catch(err => console.log(err))	
})
router.post('/signin', (req, res) => {
	const {email, password} = req.body
	if(!email || !password) return res.json({err: "Please Enter All Fields"});
	User.findOne({email: email})
	.then(user => {		
		if(!user) {			
			return res.json({err: "Invalid email or password"});
		}
		bcrypt.compare(password, user.password)
		.then(doMatch => {
			if(doMatch) {				
				const token = jwt.sign({user_id: user._id}, JWT_SECRET, {expiresIn: "365d"})
				user.token = token
				user.password = undefined;	
				res.json({user})
			}
			else {
				res.json({err: "Invalid email or password"})
			}
		})

	})
	.catch(err => console.log(err))
})

module.exports = router