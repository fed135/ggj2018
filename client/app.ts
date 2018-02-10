import {ClientMatch, default as Game} from './Game';
import NetworkClient from '../extras/system/Net';
import Lobby from "./network/Lobby";
import * as Random from "./utils/Random";
import View, {Elements} from "./view/View";
import MatchStore from "./match/Store";
import {PlayerState} from "../server/player/types";

const lobbyNameLength: number = 5;
const elements: Elements = {
  intro: {
    matchNameInput: () => document.getElementById('lobby_name') as HTMLInputElement,
    joinMatchButton: () => document.getElementById('lobby_btn'),
    introContainer: () => document.getElementById('splash'),
  },
  lobby: {
    lobbyContainer: () => document.getElementById('lobby'),
    lobbyNameLabel: () => document.getElementById('lobby_name_label'),
    readyButton: () => document.getElementById('ready_btn') as HTMLButtonElement,
    quitButton: () => document.getElementById('quit_btn') as HTMLButtonElement,
  },
  game: {
    container: () => document.getElementById('game') as HTMLDivElement,
  },

};


const setMatchNameInputFromUrl = () => {
  const matchNameFromUrl: string = window.location.href.split('#')[1] || '';
  const matchName: string = matchNameFromUrl || Random.make(lobbyNameLength);

  elements
    .intro
    .matchNameInput()
    .value = matchName;
};

const onQuitLobby = (event: MouseEvent): any => {
  window.location.href = '/ggj2018';
};

const onPlayerReady = (lobby: Lobby, matchStore: MatchStore) => (event: MouseEvent): any => {
  lobby.readyToStart(matchStore.getName());
};

const joinMatch = (lobby: Lobby, view: View) => () => {
  console.log('Can join match, network is available!');

  const matchName: string = elements
    .intro
    .matchNameInput()
    .value
    .toLowerCase();

  if (matchName === '') {
    return false;
  }

  // Wait until the user has joined a match before we listen for other events
  lobby.onSelfJoin((matchState: ClientMatch) => {
    console.log('I just joined the match!');

    const store: MatchStore = new MatchStore(matchState);
    addNewPlayer(store)(matchState);
    lobby.onNewPlayer(addNewPlayer(store));
    lobby.onStartGame(transitionToGame(store, lobby, view));


    // Transition to the lobby
    view.leaveIntro()
      .then(() => view.showLobby(
        store,
        onPlayerReady(lobby, store),
        onQuitLobby,
      ));
  });

  // Attempt to join the match
  lobby.join(matchName);
};


const refreshLobby = (matchStore: MatchStore) => {
  const players = matchStore.getPlayers();
  console.log('players', players);
  console.log('self', matchStore.getSelf());
  players.forEach((player: PlayerState, index: number) => {
    if (matchStore.getSelf().id === player.id) {
      document.getElementById(`player${index + 1}`).innerHTML = 'ME';
    }

    document.getElementById(`player${index + 1}`)
      .className = (index < players.length)
      ? 'player'
      : 'player none';
  });

};

const addNewPlayer = (matchStore: MatchStore) => (newMatchState: ClientMatch) => {
  console.log('A new challenger appears!');
  matchStore.updateState(newMatchState);
  refreshLobby(matchStore);
};

const transitionToGame = (matchStore: MatchStore, lobby: Lobby, view: View): any => () => {
  view.leaveLobby()
    .then(() => view.leaveIntro())
    .then(() => {
      lobby.disconnect();
    })
    .then(() => new Game(elements.game.container(), lobby.getNetwork(), matchStore));
};

const init = async () => {
  setMatchNameInputFromUrl();

  const view: View = new View(elements);
  const lobby: Lobby = new Lobby(new NetworkClient());
  elements.intro.joinMatchButton().onclick = joinMatch(lobby, view);
};

init();
