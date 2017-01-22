"use strict";

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function() {
	console.log('User connected via socket.io!');
});

http.listen(PORT, function() {
	console.log('Server started!');
});