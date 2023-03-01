const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Place = mongoose.model("Place")


router.post('/addplace',  (req, res) => {
	const {sight, city, province, country, cost, photo, user} = req.body;	
	if(!city || !province || !country || !cost || !photo) {
		return res.json({err: "Please Enter All Fields"})
	}
	
	const place = new Place({
		sight: sight.toLowerCase(),
		city: city.toLowerCase(),
		province: province.toLowerCase(),
		country: country.toLowerCase(),
		cost,
		photo,
		postedBy: user
	})
	place.save()
	.then(place => {		
		res.json({place})
	})
	.catch(err => {
		console.log(err)
		res.json({error: err})
	})	
})

router.get('/allplaces', (req, res) => {
	Place.find()	
	.then(places => {
		res.json({places})
	})
	.catch(err => console.log(err))
})

router.put('/addcomment', (req, res) => {
	const {text, rating, postedBy, placeid} = req.body;		
	const comment = {
		text,
		rating,
		postedBy
	}
	Place.findByIdAndUpdate(placeid, {
		$push: {comments: comment}
	}, {
		new: true
	})
	.populate("comments.postedBy", "_id name pic")
	.exec((err, result) => {

		if(err) {
			console.log(err)
			return res.status(422).json({error: err})
		}
		else {
			res.json(result)
		}
	})
})

router.get('/allcomments', (req, res) => {	
	const {placeid} = req.query;	
	Place.findOne({_id: placeid}, { comments: 1 })
	.populate('comments.postedBy', 'pic name _id')
	.then(comments => {
		res.json({comments})
	})
	.catch(err => console.log(err))
})

router.get('/getplace', (req, res) => {	
	const {placeid} = req.query;	
	Place.findOne({_id: placeid})
	.populate('postedBy', 'id name')
	.populate('comments.postedBy', 'pic name _id')
	.then(place => {	
		res.json({place})
	})
	.catch(err => console.log(err))
})

router.post('/uploadimage', (req, res) => {
	const {photo, placeid} = req.body;	
	Place.findByIdAndUpdate(placeid, {
		$push: {images: photo}
	}, {
		new: true
	})
	.then(result => {
		res.json({result})
	})
	.catch(err => console.log(err))
})


router.put('/like', (req, res) => {
	const {placeid, userid} = req.body	
	Place.findByIdAndUpdate(placeid, {
		$push: {likes: userid}
	}, {
		new: true
	})	
	.exec((err, result) => {
		if(err) {
			return res.status(422).json({error: err})
		}
		else {
			res.json(result)
		}
	})
})

router.put('/unlike', (req, res) => {
	const {placeid, userid} = req.body
	Place.findByIdAndUpdate(placeid, {
		$pull: {likes: userid}
	}, {
		new: true
	})	
	.exec((err, result) => {
		if(err) {
			return res.status(422).json({error: err})
		}
		else {
			res.json(result)
		}
	})
})

router.put('/updatepic', (req, res) => {	
	const {userid, pic} = req.body;
	User.findByIdAndUpdate(userid, {$set: {pic: pic}}, {new: true}, (err, result) => {
		if(err) {
			return res.status(422).json({error: "Pic can't post"})
		}
		return res.json(result)
	})
})

router.delete('/deletecomment/:placeid/:commentid', (req, res) => {
	const {placeid, commentid} = req.params;
	Place.findByIdAndUpdate(placeid, {
		$pull: {comments: {_id: commentid}}
	}, {
		new: true
	})	
	.populate("postedBy", "_id name")
	.populate("comments.postedBy", "_id name pic")
	.exec((err, result) => {
		if(err) {
			return res.status(422).json({error: err})
		}
		else {
			res.json(result)
		}
	})
	
})

module.exports = router