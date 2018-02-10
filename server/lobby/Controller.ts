import * as MatchStore from '../match/MatchStore';
import Player from "../player/Player";
import {Match, MatchState} from '../match/types';

const MAX_PLAYERS = 8;
const GAME_TIMER = 1000 * 60 * 2.5;


const isInLobby = (match: Match) => (
  match.state === MatchState.LOBBY
);

const acceptMorePlayer = (match: Match) => (
  match.players.length < MAX_PLAYERS
);


export const disconnect = (player: Player) => async () => {
  try {
    await MatchStore.removePlayer(player);
    await MatchStore.assignColors(player.getMatchName());

    // TODO : Send updated match to clients
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const playerIsInMatch = (targetPlayer: Player, match: Match) => (
  match.players.some((player: Player) => player === targetPlayer)
);
export const join = async (player: Player, matchName: string) => {
  const match: Match = await MatchStore.get(matchName, true);
  if (playerIsInMatch(player, match)) {
    return match;
  } else if (isInLobby(match) && acceptMorePlayer(match)) {
    MatchStore.addPlayer(matchName, player);
    player.join(match.name);
    return match;
  }

  return null;

  // try {
  //   const match: Match = await MatchStore.get(request.body.match);
  //
  //   if (isInLobby(match) && acceptMorePlayer(match)) {
  //
  //     match.players.push(player);
  //     // match.players.push(request.client);
  //
  //     request.session.match = request.body.match;
  //     request.client.on('disconnect', disconnect(request, match));
  //
  //     request.reply({state: 'lobby'});
  //     setTimeout(() => publish_update(request.client.server, match), 500);
  //   }
  //   else {
  //     request.reply('nope');
  //   }
  // } catch (error) {
  //   request.reply(error);
  // }
};


export const start = (player: Player) => (request) => {
  MatchStore.get(request.body.match)
    .then((match: Match) => {
    });
  //     match.state = request.body.state;
  //     publish_update(request.client.server, match);
  //     // Kill match after game time
  //     setTimeout(() => {
  //       MatchStore.clean(request.body.match);
  //       request.client.server.connections.forEach((connection, i) => {
  //         if (connection.session.match === match.name) {
  //           delete connection.session.match;
  //           delete connection.session.color;
  //         }
  //       });
  //     }, GAME_TIMER);
  //   }, request.reply)
};

const publish_update = (server, match) => {
  // console.log('publish_update');
  //
  // let players = 0;
  // server.connections.forEach((connection) => {
  //   if (connection.session.match === match.name && connection.socket) {
  //     connection.session.color = players++;
  //     connection.write('lobby.update', {
  //       state: match.state,
  //       players: match.players.length,
  //       name: match.name,
  //       color: connection.session.color
  //     });
  //   }
  // });
};
