import {values} from "lodash";
import {Match, Matches, MatchState} from "./types";
import Player from "../player/Player";

let matchStore: Matches = {};

const isMatchAvailable = (name: string) => matchStore.hasOwnProperty(name);

export const add = async (name: string) => {
  if (!isMatchAvailable(name)) {
    const match: Match = {
      players: [],
      state: MatchState.LOBBY,
      name
    };

    matchStore = {
      ...matchStore,
      [name]: match,
    };

    return match;
  } else {
    throw new Error('Match already exists with that name');
  }
};


const matchWithPlayer = (targetPlayer: Player) => (
  (match: Match) => !!match.players.find((player: Player) => player === targetPlayer)
);

export const removePlayer = async (targetPlayer: Player) => {
  try {
    const match: Match = await  getPlayerMatch(targetPlayer);
    const updatedPlayerList: Player[] = match.players.filter((player: Player) => targetPlayer === player);

    await updateMatch({
      ...match,
      players: updatedPlayerList,
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateMatch = async (match: Match) => {
  matchStore = {
    ...matchStore,
    name: match,
  };
};

const getPlayerMatch = async (targetPlayer: Player) => {
  `
  [ player
    for match in matchStore
      for player in match.players
        if player is targetPlayer
  ]
  `
  return values(matchStore)
    .find(matchWithPlayer(targetPlayer));
};

export const addPlayer = async (matchName: string, player: Player) => {
  try {
    const match: Match = await get(matchName, false);
    match.players.push(player);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const remove = (name: string) => {
  matchStore = {
    ...matchStore,
    name: null,
  };

  delete matchStore[name];
};

export const assignColors = async (name: string) => {
  const match = await get(name);
  match.players.forEach((player, index) => player.color = index);
};

export const get = async (name: string, createWhenUnavailable: boolean = false): Match => {
  if (isMatchAvailable(name)) {
    return matchStore[name];

  } else if (createWhenUnavailable) {
    return add(name);

  } else {
    throw new Error('No match with that name');
  }
};

