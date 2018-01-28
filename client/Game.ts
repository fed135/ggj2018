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
import Point = PIXI.Point;

const MUSHROOM = 'mushroom';
const AVATAR = 'avatar';

export type match = {
  name: string,
  state: string,
  players: number,
  color: number
};

export default class Game {

  public inputManager = new EventEmitter();
  private avatar: Avatar = null;
  private inputAccumulator = null;

  constructor(container: HTMLDivElement, Net: NetworkClient, match: match) {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application();

    this.inputManager.setMaxListeners(100);

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    container.appendChild(app.view);

    // load the texture we need
    PIXI.loader.add(MUSHROOM, './assets/sprites/mushroom.png');
    PIXI.loader.add(AVATAR, './assets/sprites/mushroom.png');
    each(rawMapData.layers, (path) => {
      if (path) {
        PIXI.loader.add(path, path);
      }
    });
    each(rawMapData.tiles, (path, id) => {
      PIXI.loader.add(id, path);
    });
    PIXI.loader.load(this.load(app));

    this.inputManager.on('input', (action) => {
      console.log('input', action);
      this.inputAccumulator.push({
        color: match.color,
        direction: action.direction
      });
    });
    this.inputManager.on('moveAccepted', (action) => {
      Net.send('player.move', action);
    });
    this.inputManager.on('movesAllAccepted', this.startPlayback.bind(this));
    this.inputAccumulator = new InputAccumulator(match, this.inputManager);
  }

  startPlayback() {
    moveAvatar(this.avatar, this.inputAccumulator.list.map((move) => {
      return move.direction;
    }), rawMapData);
  }

  load = (app) => (loader, resources) => {
    const gameContainer: PIXI.Sprite = new PIXI.Sprite();

    const avatarLayer: PIXI.Sprite = new PIXI.Sprite();
    this.avatar = new Avatar();
    avatarLayer.addChild(this.avatar);

    gameContainer.addChild(new MapView(resources, avatarLayer, rawMapData));
    gameContainer.addChild(new UIWrapper(40, 30, this.inputManager));
    gameContainer.scale = new Point(.3, .3);

    app.stage.addChild(gameContainer);

    // Listen for frame updates
    app.ticker.add(this.render);
  };

  render() {

  }
}

