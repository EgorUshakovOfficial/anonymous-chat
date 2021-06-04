const users = []; 

userJoin = (username, room, id)=>{
	let user = {username, room, id}
	users.push(user); 
	return user 
}

getUserById = id=>{
	return users.filter(user=>user.id === id)[0]
}

removeUserById = id=>{
	for (let i=0; i<users.length; i++){
		let useri = users[i]; 
		if (useri.id === id){
			return users.splice(i, 1)[0]
		}
	}
}

getUsernames = (room)=>{
	return users.filter(user=>user.room === room).map(user=>user.username)
}

module.exports = {
	userJoin, 
	getUserById, 
	removeUserById, 
	getUsernames
}