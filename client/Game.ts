import * as PIXI from 'pixi.js';
import rawMapData from './assets/map/map';
import {each} from 'lodash';
import UIWrapper from './components/UIWrapper';
import NetworkClient from '../extras/system/Net';
import {EventEmitter} from 'events';
import Avatar from "./components/Avatar";
import InputAccumulator from './InputAccumulator';
import {moveAvatar} from "./Step";
import MapView from "./map/MapView";
import {MatchState} from "../server/match/types";
import MatchStore from "./match/Store";
import {PlayerAction, PlayerState} from "../server/player/types";
import Point = PIXI.Point;

const AVATAR = 'avatar';

export type ClientMatch = {
  name: string,
  state: MatchState,
  players: PlayerState[],
  self: string,
}
// export type ClientMatch = {
//   name: string,
//   state: string,
//   playerCount: number,
//   color: number
// };
const TypicalDeviceHeight = 400;

class GameNetwork {
  constructor(private network: NetworkClient) {

  }

  sendInput(action: { direction: PlayerAction }) {
    this.network.send(PlayerAction.INPUT, action);
  }
}

export default class Game {

  public inputDispatcher: EventEmitter = new EventEmitter();
  private app: PIXI.Application;
  private avatar: Avatar;
  private inputAccumulator: InputAccumulator;
  private gameContainer: PIXI.Sprite;
  private gameNetwork: GameNetwork;

  constructor(container: HTMLDivElement, networkClient: NetworkClient, matchStore: MatchStore) {
    this.gameNetwork = new GameNetwork(networkClient);

    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    this.app = new PIXI.Application({width: window.innerWidth, height: window.innerHeight});
    window.addEventListener("resize", this.resizeGameView.bind(this));

    // Dispatcher setup
    this.inputDispatcher.setMaxListeners(100);
    this.inputDispatcher.on('input', (action) => {
      navigator.vibrate([100, 10, 100]);
      this.gameNetwork.sendInput({
        direction: action.direction,
      });
    });
    this.inputDispatcher.on('moveAccepted', (action) => {
      networkClient.send('player.move', action);
    });
    // this.inputDispatcher.on('movesAllAccepted', (request) => {
    //   console.log('movesAllAccepted', request);
    // this.startPlayback.bind(this)
    // });

    // View setup
    // The application will create a canvas element for you that you
    // can then insert into the DOM
    container.appendChild(this.app.view);

    // load the texture we need
    PIXI.loader.add(AVATAR, './assets/sprites/mushroom.png');
    each(rawMapData.layers, (path) => {
      if (path) {
        PIXI.loader.add(path, path);
      }
    });
    each(rawMapData.tiles, (path, id) => {
      PIXI.loader.add(id, path);
    });
    PIXI.loader.load(this.load(this.app));

    this.inputAccumulator = new InputAccumulator(matchStore, this.inputDispatcher);
    networkClient.subscribe('player.move', this.inputAccumulator.push.bind(this.inputAccumulator));
    networkClient.subscribe('game.vote_is_over', (request) => {
      console.log('game.vote_is_over', request.voteResult);
      moveAvatar(this.avatar, request.voteResult, rawMapData);
    });
  }

  resizeGameView() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);

    const ratio = TypicalDeviceHeight / window.screen.height;

    if (this.gameContainer) {
      this.gameContainer.scale = new Point(ratio, ratio);
    }
  }

  startPlayback() {
    moveAvatar(this.avatar, this.inputAccumulator.list.map((move) => {
      return move.direction;
    }), rawMapData);
  }

  load = (app) => (loader, resources) => {
    this.gameContainer = new PIXI.Sprite();
    const avatarLayer: PIXI.Sprite = new PIXI.Sprite();

    this.gameContainer.addChild(new MapView(resources, avatarLayer, rawMapData));

    app.stage.addChild(this.gameContainer);
    app.stage.addChild(new UIWrapper(this.gameContainer.scale.x, this.inputDispatcher));

    this.resizeGameView();

    this.avatar = new Avatar();
    avatarLayer.x += 1200 * 0.380;
    avatarLayer.y += 120;
    avatarLayer.addChild(this.avatar);

    // Listen for frame updates
    app.ticker.add(this.render);
  };

  render() {

  }
}

