import * as PIXI from 'pixi.js';
import rawMapData from './assets/map/map';
import {Map, parseMap, Tile, MapData} from "./map/Map";
import {each} from 'lodash';
import UIWrapper from './components/UIWrapper';
import NetworkClient from '../extras/system/Net';
import {EventEmitter} from 'events';
import Avatar, {Action} from "./components/Avatar";
import {TweenLite} from 'gsap';

const MUSHROOM = 'mushroom';
const AVATAR = 'avatar';


export default class Game {

  public inputManager = new EventEmitter();

  constructor(container: HTMLDivElement, Net: NetworkClient) {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application();

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

    this.inputManager.on('input', this.handlePlayerInput);
  }

  handlePlayerInput(action) {
    console.log('input', action);
  }

  load = (app) => (loader, resources) => {
    loadStaticLayers(app.stage, rawMapData, resources);
    const ui = new UIWrapper(app.stage, this.inputManager);

    const avatar = new Avatar();
    app.stage.addChild(avatar);

    // Listen for frame updates
    app.ticker.add(this.render);
  };

  render() {

  }
}

const loadStaticLayers = (container: PIXI.Container, map: MapData, resources) => {
  map.layers.forEach((layer: string) => {
    if (layer === null) {
      loadInteractiveLayer(container, parseMap(rawMapData), resources);
    } else {
      const graphic: PIXI.Sprite = new PIXI.Sprite(resources[layer].texture);
      container.addChild(graphic);
    }
  });
};

const loadInteractiveLayer = (container: PIXI.Container, map: Map, resources) => {
  map.map((tile: Tile) => {
    const graphic: PIXI.Sprite = new PIXI.Sprite(resources[tile.tileId].texture);

    // Setup the position of the bunny
    graphic.x = tile.x;
    graphic.y = tile.y;

    container.addChild(graphic);
  });
};
