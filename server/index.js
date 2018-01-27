/**
 * Server router
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const Kalm = require('kalm');
const WS = require('kalm-websocket');
const MatchStore = require('./MatchStore');

const lobbyController = require('./lobby');
const gameController = require('./game');

/* Init ----------------------------------------------------------------------*/

const socketApp = Kalm.listen({
	socketTimeout: 5 * 60 * 1000,
	transport: WS,
	port: 9000,
	profile: { tick: 5 }
});

/* Game ----------------------------------------------------------------------*/

// LOBBY
socketApp.subscribe('lobby.join', lobbyController.join.bind(socketApp), {
	delay: 0,
});

socketApp.subscribe('lobby.update', lobbyController.start.bind(socketApp), {
	delay: 0,
});

// GAME
socketApp.subscribe('player.move', gameController.move.bind(socketApp), {
	delay: 1000/60,
});

socketApp.subscribe('player.punch', gameController.punch.bind(socketApp), {
	delay: 1000/60,
});

socketApp.subscribe('player.spawn', gameController.spawn.bind(socketApp), {
	delay: 0,
});

socketApp.subscribe('player.vibrate', gameController.vibrate.bind(socketApp), {
	delay: 0,
});

// Others
socketApp.catch((payload, client) => {
	// TODO: ONLY accept during DEV! Make sure this is turned off in prod  
	console.log('Unexpected payload:', payload);
	console.log(client);
	client.send('errors', 'Unexpected payload');
});