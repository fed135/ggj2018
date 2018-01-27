/**
 * Lobby
 */

'use strict';

/* Requires ------------------------------------------------------------------*/

const MatchStore = require('./MatchStore');

/* Local variables -----------------------------------------------------------*/

const MAX_PLAYERS = 8;
const GAME_TIMER = 1000 * 60 * 2.5;

/* Methods -------------------------------------------------------------------*/

function join(packet, reply, channel) {
	MatchStore.get_or_make(packet.match)
		.then((match) => {
			if (packet.role === 'spectate') {
				channel._client.match = packet.match;
				channel._client.role = 'spectate';
				reply({
					state: match.state, 
					players: match.players.length,
					name: packet.match
				});
			}
			else {
				if (match.state === 'lobby' && match.players.length < MAX_PLAYERS) {
					match.players.push(channel._client);
					channel._client.match = packet.match;
					channel._client.role = 'play';
					channel._client.on('disconnect', () => {
						// Remove me from lobby
						let i = match.players.indexOf(channel._client);
						if (i > -1) match.players.splice(i, 1);
						setTimeout(() => {
							publish_update(this, match);
						}, 10);
					});
					reply({state: 'lobby'});
					setTimeout(() => publish_update(this, match), 100);
				}
				else {
					reply('nope');
				}
			}
		}, reply);
}

function start(packet, reply) {
	MatchStore.get(packet.match)
		.then((match) => {
			match.state = packet.state;
			publish_update(this, match);
			// Kill match after game time
			setTimeout(() => {
				MatchStore.clean(packet.match);
				this.connections.forEach((connection, i) => {
					if (connection.match === match.name) {
						delete connection.match;
						delete connection.color;
						delete connection.role;
					}
				});
			}, GAME_TIMER);
		}, reply)
}

function publish_update(server, match) {
	let players = 0;
	server.connections.forEach((connection, i) => {
		if (connection.match === match.name && connection.socket) {
			connection.color = (connection.role === 'play')?players++:null;
			connection.send('lobby.update', {
				state: match.state, 
				players: match.players.length,
				name: match.name,
				color: connection.color
			});
		}
	});
}

/* Exports -------------------------------------------------------------------*/

module.exports = { join, start };