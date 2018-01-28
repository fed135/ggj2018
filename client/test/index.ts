import 'mocha';
import {expect} from 'chai';
import mapData from '../assets/map/map_dev';
import {MapData, mapValidation, parseMap, Tile} from "../map/MapParser";

describe('mapValidation', () => {
  it('should return true if the data is valid', () => {
    const result = mapValidation(mapData);
    expect(result).to.be.true;
  });
  it('should throw an error if data is invalid', () => {
    try {
      mapValidation({} as MapData);
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
      layers: [],
      map: [
        0, 0,
        0, 0,
      ],
    };
    const finalMap: Tile[] = parseMap(mockedMap);

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
