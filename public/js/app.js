const name = getQueryVariable('name') || 'Anonymous';
const room = getQueryVariable('room');
const socket = io();

jQuery('.room-title').text(room);

socket.on('connect', function() {
	console.log('Connected to socket.io server!');
	socket.emit('joinRoom', {
		name,
		room
	});
});

socket.on('message', function(message) {
	const momentTimestamp = moment.utc(message.timestamp);
	const $message = jQuery('.messages')

	console.log('New message:');
	console.log(message.text);

	$message.append(`<p><strong>${message.name} ${momentTimestamp.local().format('h:mm a')}</strong></p>`);
	$message.append(`<p>${message.text}</p>`);
});

// Handles submitting of new message
const $form = jQuery('#message-form');

$form.on('submit', function(event) {
	event.preventDefault();

	const $message = $form.find('input[name=message]');

	socket.emit('message', {
		name,
		text: $message.val()
	});

	$message.val('');
});