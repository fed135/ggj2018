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

const AVATAR = 'avatar';

export type match = {
  name: string,
  state: string,
  players: number,
  color: number
};
const TipicalDeviceHeight = 400;

export default class Game {

  public inputManager = new EventEmitter();
  private avatar: Avatar = null;
  private inputAccumulator = null;
  private gameContainer: PIXI.Sprite = null;

  constructor(container: HTMLDivElement, Net: NetworkClient, match: match) {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application();
    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);

      const ratio = (
        Math.min(window.screen.height, TipicalDeviceHeight) /
        Math.max(window.screen.height, TipicalDeviceHeight)
      );
      if (this.gameContainer) {
        this.gameContainer.scale = new Point(ratio, ratio);
      }
    });

    this.inputManager.setMaxListeners(100);
    this.inputAccumulator = new InputAccumulator(match, this.inputManager);

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    container.appendChild(app.view);

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
    PIXI.loader.load(this.load(app));

    this.inputManager.on('input', (action) => {
      navigator.vibrate([100, 10, 100])
      this.inputAccumulator.push({
        color: match.color,
        direction: action.direction
      });
    });
    Net.subscribe('player.move', this.inputAccumulator.push.bind(this.inputAccumulator));
    this.inputManager.on('moveAccepted', (action) => {
      Net.send('player.move', action);
    });
    this.inputManager.on('movesAllAccepted', this.startPlayback.bind(this));
  }

  startPlayback() {
    moveAvatar(this.avatar, this.inputAccumulator.list.map((move) => {
      return move.direction;
    }), rawMapData);
  }

  load = (app) => (loader, resources) => {

    this.gameContainer = new PIXI.Sprite();
    const avatarLayer: PIXI.Sprite = new PIXI.Sprite();
    this.avatar = new Avatar();
    avatarLayer.addChild(this.avatar);

    this.gameContainer.addChild(new MapView(resources, avatarLayer, rawMapData));
    this.gameContainer.addChild(new UIWrapper(TipicalDeviceHeight, this.inputManager));

    app.stage.addChild(this.gameContainer);

    // Listen for frame updates
    app.ticker.add(this.render);
  };

  render() {

  }
}

