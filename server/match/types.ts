import Player from "../player/Player";

export enum MatchState {
  LOBBY = 'lobby',
}

export type Match = {
  name: string,
  state: MatchState,
  players: Player[],
}

export type Matches = {
  [name: string]: Match,
}
