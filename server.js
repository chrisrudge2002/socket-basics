"use strict";

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const moment = require('moment');

app.use(express.static(__dirname + '/public'));

const clientInfo = {};

// Sends current users to provided socekt
function sendCurrentUsers(socket) {
	const info = clientInfo[socket.id];
	let users = [];

	if (typeof info === 'undefined') {
		return;
	}

	Object.keys(clientInfo).forEach(socketId => {
		const userInfo = clientInfo[socketId];
		if (userInfo.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: `Current users: ${users.join(', ')}`,
		timestamp: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('User connected via socket.io!');

	socket.on('disconnect', function() {
		const userData = clientInfo[socket.id];

		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: `${userData.name} has left!`,
				timestamp: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: 'System',
			text: `${req.name} has joined!`,
			timestamp: moment().valueOf()
		});
	});

	socket.on('message', function(message) {
		console.log(`Message received: ${message.text}`);

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Welcome to the chat application!',
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('Server started!');
});