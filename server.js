var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = "mongodb+srv://luizbag:srXS1u9VdtMBKzKR@cluster0.xlcj2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
var dbOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
	res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)
    message.save((err) => {
	if(err) res.sendStatus(500)
	messages.push(req.body)
	io.emit('message', req.body)
	res.sendStatus(200)
    })
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

mongoose.connect(dbUrl, dbOptions, (err) => {
    console.log('mongodb connection', err)
})

var server = http.listen(3000, '0.0.0.0', () => {
    console.log('server is listening on port ', server.address().port)
})
