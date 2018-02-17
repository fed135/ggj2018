import Player from "./player/Player";
import * as Kalm from 'kalm';
import * as wss from 'kalm-secure-websocket';
import * as ws from 'kalm-websocket';
import * as fs from 'fs';
import * as LobbyController from './lobby/Controller';
import {LobbyActions} from './lobby/types';
import {Match, MatchState} from "./match/types";
import {IConnection} from "./types";
import * as MatchStore from "./match/MatchStore";
import {Input, PlayerAction} from "./player/types";
import * as GameController from "./game";


const shouldUseSecureConnection = !!process.env.SECURE;
const port = process.env.SERVER_PORT || 9000;
const host = process.env.SERVER_HOST || '0.0.0.0';

console.log(`
Setup server with :
  port: ${port}
  host: ${host}
`);

/* Init ----------------------------------------------------------------------*/

const socketApp = Kalm.listen({
  hostname: host,
  socketTimeout: 5 * 60 * 1000,
  transport: shouldUseSecureConnection ? wss : ws,
  port,
  profile: {tick: 5},
  ssl: shouldUseSecureConnection
    ? {
      key: fs.readFileSync('./ssl/privkey.pem'),
      cert: fs.readFileSync('./ssl/cert.pem'),
    }
    : {}
});

/* Game ----------------------------------------------------------------------*/
type SendEvent = (event?: string, data?: Object) => void;
type GetCustomData = (player: Player, send: SendEvent) => void;

const sendUpdatedMatchState = (player: Player, match: Match) => (action: string = LobbyActions.UPDATE, data: Object = {}) => {
  console.log(`Sending ${action} to:`, player.getId());
  player.connection.write(action, {
    name: match.name,
    state: match.state,
    players: match.players.map(player => player.parse()),
    self: player.getId(),
    ...data,
  });
};

const update = (match: Match, getCustomData: GetCustomData) => {
  console.log('publish_update');

  match.players
    .filter(player => !!player.connection.socket)
    .forEach((player: Player) => {
      getCustomData(player, sendUpdatedMatchState(player, match));
    });
};

const simplySend = (action: LobbyActions) => (player, send) => send(action);

// LOBBY
socketApp.on('connection', (connection: IConnection) => {
  const currentPlayer: Player = new Player(connection);
  console.log('New connection with connection id:', connection.id);

  connection.subscribe(LobbyActions.JOIN, async (request) => {
    console.log(LobbyActions.JOIN, currentPlayer.getId());
    try {
      const matchName: string = request.body.match;
      const match: Match = await LobbyController.join(currentPlayer, matchName);
      await MatchStore.assignColors(currentPlayer.getMatchName());

      connection.on('disconnect', LobbyController.disconnect(currentPlayer));

      request.reply({state: MatchState.LOBBY});

      /**
       * To help client detect when it's player is added to the match,
       * send a "self join" event to the current player
       * and regular "join" to everyone else
       */
      update(match, (player, send) => {
        if (currentPlayer.getId() === player.getId()) {
          send(LobbyActions.SELF_JOIN);
        }

        send(LobbyActions.JOIN);
      });

    } catch (error) {
      console.error(error);
      throw error;
    }
  });

  connection.subscribe(LobbyActions.PLAYER_READY, async () => {
    await MatchStore.assignColors(currentPlayer.getMatchName());
    const match: Match = await MatchStore.get(currentPlayer.getMatchName());
    update(match, simplySend(LobbyActions.START))
  });


  // // GAME
  connection.subscribe(PlayerAction.INPUT, async (request) => {
    await GameController.input(currentPlayer, request.body.direction);

    const match: Match = await MatchStore.get(currentPlayer.getMatchName());
    const inputs: Input[][] = match.players
      .map(player => player.getInputs());

    const isVoteOver: boolean = await GameController.isVoteOver(inputs);

    if (isVoteOver) {
      match.players.forEach(player => player.flushInputs());
      const voteResult: Input[] = GameController.getMostVotedInputs(inputs);

      match.players.forEach(player => {
        player.connection.write('game.vote_is_over', {voteResult});
      });
    }
  });
// connection.subscribe('currentPlayer.move', gameController.move(currentPlayer));
//
// connection.subscribe('currentPlayer.punch', gameController.punch(currentPlayer));
//
// connection.subscribe('currentPlayer.spawn', gameController.spawn(currentPlayer));
//
// connection.subscribe('currentPlayer.vibrate', gameController.vibrate(currentPlayer));
})
;

