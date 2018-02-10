import Player from "./player/Player";
import * as MatchStore from "./match/MatchStore";
import {Match} from "./match/types";
import {PlayerAction} from "./player/types";

const crypto = require('crypto');

export const input = (player: Player) => async (request) => {
  console.log(player.getId(), 'move', request.body);

  player.addInput(request.body.action);
  const match: Match = await MatchStore.get(player.getMatchName());
  const inputs: PlayerAction[][] = match.players
    .map(player => player.getInputs());

  const shouldFlushInputs: boolean = inputs
    .map(actions => actions.length)
    .every(length => length >= Player.maxMovePerTurn);

  if (shouldFlushInputs) {
    [
      [1, 2, 3],
      [2, 1, 3],
      [3, 1, 3],
      [2, 1, 3],
    ]
      [2, 1, 3]
  }
};

export const move = (player: Player) => (request) => {
  console.log(player.getId(), 'move', request.body);
  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && request.session.role === 'spectate') {
      player.move(request.body.move);
      connection.write('player.move', request.body);
    }
  });
};

export const punch = (player) => (request) => {
  console.log(player, 'punch', request.body);
  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && request.session.role === 'spectate') {
      connection.write('player.punch', request.body);
    }
  });
};

export const spawn = (player) => (request) => {
  console.log(player, 'spawn', request.body);
  request.session.player = request.body.player || crypto.randomBytes(20).toString('hex');
  request.body.player = request.session.player;

  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && request.session.role === 'spectate') {
      connection.write('player.spawn', request.body);
    }
  });
};

export const vibrate = (player) => (request) => {
  console.log(player, 'vibrate', request.body);
  request.client.server.connections.forEach((connection) => {
    if (connection.match === request.body.match && connection.color === player.color) {
      connection.write('player.vibrate', request.body);
    }
  });
};
