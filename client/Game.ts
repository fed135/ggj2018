import * as PIXI from 'pixi.js';
import MapData from './assets/map/map';
import {Map, parseMap, Tile} from "./map/Map";
import {each} from 'lodash';

const MUSHROOM = 'mushroom';


export default class Game {

  constructor(container: HTMLDivElement) {
    // The application will create a renderer using WebGL, if possible,
    // with a fallback to a canvas render. It will also setup the ticker
    // and the root stage PIXI.Container
    const app = new PIXI.Application();

    // The application will create a canvas element for you that you
    // can then insert into the DOM
    container.appendChild(app.view);

    // load the texture we need
    PIXI.loader.add(MUSHROOM, './assets/sprites/mushroom.png');
    each(MapData.tiles, (path, id) => {
      PIXI.loader.add(id, path);
    });
    PIXI.loader.load(this.load(app));
  }

  load = (app) => (loader, resources) => {
    const map: Map = parseMap(MapData);
    map.map((tile: Tile) => {
      const graphic: PIXI.Sprite = new PIXI.Sprite(resources[tile.tileId].texture);

      // Setup the position of the bunny
      graphic.x = tile.x;
      graphic.y = tile.y;

      app.stage.addChild(graphic);

    });

    // Listen for frame updates
    app.ticker.add(this.render);
  };

  render() {

  }
}
