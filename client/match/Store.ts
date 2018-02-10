import {ClientMatch} from "../Game";
import {PlayerState} from "../../server/player/types";


export default class MatchStore {
  public getName = (): string => this.matchState.name;
  public getPlayers = (): PlayerState[] => this.matchState.players;
  public getSelf = (): PlayerState => (
    this.matchState.players.find((player: PlayerState) => player.id === this.matchState.self)
  );

  constructor(private matchState: ClientMatch) {
    console.log('MatchStore', 'new matchState', this.matchState);
  }

  updateState(newMatchState: ClientMatch): void {
    console.log('Update match state');
    this.matchState = Object.assign(
      {},
      this.matchState,
      newMatchState,
    );
  }

}
