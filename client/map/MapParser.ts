import {isEmpty, keys, uniq} from 'lodash';

export type MapData = {
  width: number,
  tileWidth: number,
  tileHeight: number,
  tiles: { [key: number]: string },
  map: number[],
  layers: string[],
};

export interface Tile {
  x: number,
  y: number,
  width: number,
  height: number,
  resourceUrl: string,
  tileId: number,
}

const isIn = (keys) => (key) => {
  const isPresent = keys.includes(key);
  if (!isPresent) {
    console.log(`Key ${key} can't be found inside ${keys}`);
  }
  return isPresent;
};
export const mapValidation = (mapData: MapData): boolean => {
  if (mapData.width <= 0) {
    throw new Error(`Map "width" should be greater than 0. Found ${mapData.width}`);
  }

  if (isEmpty(mapData.tiles)) {
    throw new Error('Map "tiles" should not be empty');
  }
  if (isEmpty(mapData.map)) {
    throw new Error('Map "map" should not be empty');
  }

  const keyList = keys(mapData.tiles);
  const tileKeys = keyList.map((key) => parseInt(key));
  if (!uniq(mapData.map).every(isIn(tileKeys))) {
    throw new Error('A key was used in Map.map that was not defined in Map.tiles');
  }

  return true;
};

export const parseMap = (mapData: MapData): Tile[] => {
  mapValidation(mapData);

  return mapData.map.map((tileId, index) => {
    return {
      x: Math.floor(index % mapData.width) * mapData.tileWidth,
      y: Math.floor(index / mapData.width) * mapData.tileHeight,
      width: mapData.tileWidth,
      height: mapData.tileHeight,
      resourceUrl: mapData.tiles[tileId],
      tileId,
    };
  });
};

