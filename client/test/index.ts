import {uniq, keys, isEmpty} from 'lodash';
import {it, describe} from 'mocha';
import {expect} from 'chai';
import mapData from '../assets/map/map_dev';

type MapData = {
  width: number,
  tileWidth: number,
  tileHeight: number,
  tiles: { [key: number]: string },
  map: number[],
};

interface Tile {
  x: number,
  y: number,
  width: number,
  height: number,
  resourceUrl: string,
  tileId: number,
}

type Map = Tile[];

const isIn = (keys) => (key) => keys.includes(key);
const mapValidation = (mapData: MapData): boolean => {
  if (mapData.width <= 0) {
    throw new Error(`Map "width" should be greater than 0. Found ${mapData.width}`);
  }

  if (isEmpty(mapData.tiles)) {
    throw new Error('Map "tiles" should not be empty');
  }
  if (isEmpty(mapData.map)) {
    throw new Error('Map "map" should not be empty');
  }

  const tileKeys = keys(mapData.tiles).map(parseInt);
  if (!uniq(mapData.map).every(isIn(tileKeys))) {
    throw new Error('A key was used in Map.map that was not defined in Map.tiles');
  }

  return true;
};

const parseMap = (mapData: MapData): Map => {
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

describe('mapValidation', () => {
  it('should return true if the data is valid', () => {
    const result = mapValidation(mapData);
    expect(result).to.be.true;
  });
  it('should throw an error if data is invalid', () => {
    try {
      mapValidation({});
    } catch (error) {
      expect(error.message).to.not.be.undefined;
    }
  });
});

describe('map utils', () => {
  it('should parse a map', () => {
    const mockedMap = {
      width: 2,
      tileWidth: 40,
      tileHeight: 15,
      tiles: {
        0: 'default.png',
      },
      map: [
        0, 0,
        0, 0,
      ],
    };
    const finalMap: Map = parseMap(mockedMap);

    expect(finalMap.length).to.be.equal(mockedMap.map.length);

    expect(finalMap[0].x).to.be.equal(0);
    expect(finalMap[0].y).to.be.equal(0);
    expect(finalMap[0].resourceUrl).to.be.equal(mockedMap.tiles[finalMap[0].tileId]);
    expect(finalMap[0].width).to.be.equal(mockedMap.tileWidth);
    expect(finalMap[0].height).to.be.equal(mockedMap.tileHeight);


    expect(finalMap[1].x).to.be.equal(40);
    expect(finalMap[1].y).to.be.equal(0);
    expect(finalMap[1].resourceUrl).to.be.equal(mockedMap.tiles[finalMap[1].tileId]);
    expect(finalMap[1].width).to.be.equal(mockedMap.tileWidth);
    expect(finalMap[1].height).to.be.equal(mockedMap.tileHeight);

    expect(finalMap[2].x).to.be.equal(0);
    expect(finalMap[2].y).to.be.equal(15);
    expect(finalMap[2].resourceUrl).to.be.equal(mockedMap.tiles[finalMap[2].tileId]);
    expect(finalMap[2].width).to.be.equal(mockedMap.tileWidth);
    expect(finalMap[2].height).to.be.equal(mockedMap.tileHeight);

    expect(finalMap[3].x).to.be.equal(40);
    expect(finalMap[3].y).to.be.equal(15);
    expect(finalMap[3].resourceUrl).to.be.equal(mockedMap.tiles[finalMap[3].tileId]);
    expect(finalMap[3].width).to.be.equal(mockedMap.tileWidth);
    expect(finalMap[3].height).to.be.equal(mockedMap.tileHeight);
  });
});
