import {LobbyActions} from "../../server/lobby/types";
import NetworkClient from '../../extras/system/Net';
import {ClientMatch} from "../Game";
import {values} from "lodash";

export default class Lobby {
  getNetwork = (): NetworkClient => this.network;

  disconnect = (): void => (
    values(LobbyActions)
      .forEach((action) => this.network.removeAllListeners(action))
  );

  get networkClient(): NetworkClient {
    return this.network;
  }

  constructor(private network: NetworkClient) {
  }

  public onSelfJoin(callback): void {
    const unsubscribeAfterSelfJoin = (matchState: ClientMatch) => {
      this.network.unsubscribe(unsubscribeAfterSelfJoin);
      callback(matchState)
    };

    this.network.subscribe(LobbyActions.SELF_JOIN, callback);
  }

  public onNewPlayer(callback): void {
    this.network.subscribe(LobbyActions.JOIN, callback);
  }

  public join(matchName: string): void {
    console.log('join match:', matchName);
    this.network.send(LobbyActions.JOIN, {
      match: matchName
    });
  }

  onLobbyUpdate(updateMatchState: (newMatchState: ClientMatch) => void) {
    this.network.subscribe(LobbyActions.UPDATE, (newMatchState: ClientMatch) => {
      console.log('New match state!', newMatchState);
      updateMatchState(newMatchState);
    });
  }

  readyToStart(matchName: string) {
    console.log('readyToStart match:', matchName);
    this.network.send(LobbyActions.PLAYER_READY, {state: 'lobby', matchName});
  }

  onStartGame(callback: Function) {
    this.network.subscribe(LobbyActions.START, callback);
  }
}