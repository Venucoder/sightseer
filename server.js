const express = require('express')
const cors = require('cors')
const cookieSession = require('cookie-session')
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

const app = express();

require('./models/user')
require('./models/place')


var corsOptions = {
	origin: "http://localhost:3000"
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(
	cookieSession({
		name: "sightseer-session",
		secret: "COOKIE_SECRET",
		httpOnly: true
	})
)

app.use(require('./routes/auth'))
app.use(require('./routes/place'))
app.use(require('./routes/user'))

app.get('/', (req, res) => {
	res.json({message: MONGOURI})
})


mongoose.connect(MONGOURI, { useUnifiedTopology:true,useNewUrlParser: true })

mongoose.connection.on('connected', () => {
	console.log("Connected to mongo DB")
})

mongoose.connection.on('error', (err) => {
	console.log("err connecting", err)
})

const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV == "production") {
	app.use(express.static('sightseer/build'))
	const path = require('path')
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, 'sightseer', 'build', 'index.html'))
	})
}
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`)
})