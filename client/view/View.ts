import MatchStore from "../match/Store";

export type Elements = {
  intro: {
    matchNameInput: () => HTMLInputElement,
    joinMatchButton: () => HTMLElement,
    introContainer: () => HTMLElement,
  },
  lobby: {
    lobbyContainer: () => HTMLElement,
    lobbyNameLabel: () => HTMLElement,
    readyButton: () => HTMLButtonElement,
    quitButton: () => HTMLButtonElement,
  },
  game: {
    container: () => HTMLDivElement,
  },

};

type ButtonCallback = (this: HTMLElement, event: MouseEvent) => any;

export default class View {
  constructor(private elements: Elements) {
  }

  async leaveIntro() {
    this.elements.intro.introContainer().style.display = 'none';
  }

  async showLobby(match: MatchStore, onReady: ButtonCallback, onQuit: ButtonCallback) {
    console.log('showLobby');
    this.elements.lobby.lobbyContainer().style.display = 'block';
    this.elements.lobby.lobbyNameLabel().innerHTML = 'lobby: ' + match.getName();

    this.elements.lobby.readyButton().onclick = onReady;
    this.elements.lobby.quitButton().onclick = onQuit;
  }

  async leaveLobby() {
    this.elements.lobby.lobbyContainer().style.display = 'none';
  }

  async showGame(network, match) {
  }
}