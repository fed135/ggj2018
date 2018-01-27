/**
 * Game
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const crypto = require('crypto');

const MatchStore = require('./MatchStore');

/* Local variables -----------------------------------------------------------*/

/* Methods -------------------------------------------------------------------*/

function move(packet, reply, channel) {
	this.connections.forEach((connection) => {
		if (connection.match === packet.match && connection.role === 'spectate') {
			connection.send('player.move', packet);
		}
	});
}

function punch(packet, reply, channel) {
	this.connections.forEach((connection) => {
		if (connection.match === packet.match && connection.role === 'spectate') {
			connection.send('player.punch', packet);
		}
	});
}

function spawn(packet, reply, channel) {
	channel._client.player = packet.player || crypto.randomBytes(20).toString('hex');
	packet.player = channel._client.player

	this.connections.forEach((connection) => {
		if (connection.match === packet.match && connection.role === 'spectate') {
			connection.send('player.spawn', packet);
		}
	});
}

function vibrate(packet, reply, channel) {
	this.connections.forEach((connection) => {
		if (connection.match === packet.match && connection.color === packet.color) {
			connection.send('player.vibrate', packet);
		}
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = { spawn, punch, move, vibrate };