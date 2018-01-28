import {MapData, parseMap, Tile} from "./MapParser";
import Point = PIXI.Point;

const loadStaticLayers = (container: PIXI.Container, specialLayer: PIXI.Sprite, rawMapData: MapData, resources) => {
  rawMapData.layers.forEach((layer: string) => {
    if (layer === null) {
      // Fill and add the special layer
      loadInteractiveLayer(specialLayer, parseMap(rawMapData), resources);
      container.addChild(specialLayer);
    } else {
      const graphic: PIXI.Sprite = new PIXI.Sprite(resources[layer].texture);
      container.addChild(graphic);
    }
  });
};

const loadInteractiveLayer = (container: PIXI.Container, tiles: Tile[], resources) => {
  tiles.map((tile: Tile) => {
    const graphic: PIXI.Sprite = new PIXI.Sprite(resources[tile.tileId].texture);

    // Setup the position of the bunny
    graphic.x = tile.x;
    graphic.y = tile.y;

    container.addChild(graphic);
  });
};

export default class MapView extends PIXI.Sprite {
  constructor(resources, specialLayer: PIXI.Sprite, rawMapData: MapData) {
    super();
    loadStaticLayers(this, specialLayer, rawMapData, resources);
  }

}