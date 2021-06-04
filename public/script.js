var socket = io();

var form = document.getElementById('chat-form'); 

input = document.getElementById('input'); 

var messages = document.getElementById('messages'); 

var users = document.getElementById('users')

// Username and Room number 
const info = window.location.search.replace(/\?username=|rooms=/g, '').split('&'); 

// User joins room 
socket.emit('join room', {username:info[0].replace('+', " "), room: info[1]}); 


// User sends message 
form.addEventListener('submit', event=>{
	event.preventDefault(); 
	if (input.value){
		socket.emit('chat message', input.value); 
		input.value = ''; 
	}
})

// Update users in room 
socket.on('update users', data=>{
	const {usernames} = data 
	users.innerHTML = ''; 
	usernames.forEach(username=>{
		let newElement = document.createElement('li'); 
		newElement.innerHTML = username;  
		users.appendChild(newElement); 
	})

})

// User receives message 
socket.on('chat message', data=>{
	// Destructure object
	const {username, message} = data; 

	// Create new div element 
	let newElement = document.createElement('div'); 
	
	// Populate new div element with message from server 
	newElement.innerHTML = `${username}: ${message}`; 

	// Style element 
	newElement.classList.add('message'); 
	
	// Append element to the DOM 
	messages.appendChild(newElement); 
})