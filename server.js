const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

const app = express();

require('./models/user')
require('./models/place')

app.use(cors())
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
})

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use(require('./routes/auth'))
app.use(require('./routes/place'))
app.use(require('./routes/user'))

app.get('/', (req, res) => {
	res.json({message: "Welcome to Sightseer"})
})


mongoose.connect(MONGOURI, { useUnifiedTopology:true,useNewUrlParser: true })

mongoose.connection.on('connected', () => {
	console.log("Connected to mongo DB")
})

mongoose.connection.on('error', (err) => {
	console.log("err connecting", err)
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}.`)
})