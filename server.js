require('dotenv').config();

const path = require('path');

const bodyParser = require('body-parser')

const express = require("express");
const app = express(); 
const http = require('http'); 
const server = http.createServer(app); 
const { Server } = require('socket.io'); 
const io = new Server(server); 

const formatMessage = require('./utils/formatMessage'); 

const {userJoin, getUserById, removeUserById, getUsernames} = require('./utils/users'); 

const PORT = process.env.PORT || 3000 ; 

// Set view engine 
app.set('view engine', 'pug')

// Set static folder 
app.use(express.static(path.join(__dirname, '/public')))

// Middleware 
app.use(bodyParser.urlencoded({extended: false}))

//Routes 
app.get('/chat', (req, res)=>{
	res.render('chat', req.query)
})


// Io connection 
io.on('connection', socket=>{
	const chatBot = 'Chatbot'; 

	// User joins room 
	socket.on('join room', data=>{
		const {username, room} = data;
		
		// Add user to the database 
		let user = userJoin(username, room, socket.id); 

		// Subscribe to channel 
		socket.join(user.room)

		// User connects to Chatcord 
		socket.broadcast.to(user.room).emit('chat message', formatMessage(chatBot, `${user.username} has joined the chat`));

		// Update list of users in the room
		io.to(user.room).emit('update users', {
			usernames: getUsernames(user.room)
		})
	}) 
	
	// User sends message 
	socket.on('chat message', message=>{
		let user = getUserById(socket.id); 
		io.to(user.room).emit('chat message', formatMessage(user.username, message));
	
	});

	// User disconnects 
	socket.on('disconnect', ()=>{
		let user = removeUserById(socket.id);
		if (user){
			// Update list of users in the room
			io.to(user.room).emit('update users', {
				usernames: getUsernames(user.room)
			})

			// User left the chat 
			io.to(user.room).emit('chat message', formatMessage(chatBot, `${user.username} has left the chat`));
		}	
	})
})




server.listen(PORT, ()=>console.log(`Listening on ${PORT}`))
