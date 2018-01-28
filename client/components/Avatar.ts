import {TimelineLite, Power0} from 'gsap';
import {MapData} from "../map/Map";

export enum Action {
  UP='top',
  DOWN='bottom',
  LEFT='left',
  RIGHT='right',
}

type Point = {
  x: number,
  y: number,
}

type MoveCommands = {
  [move: string]: (
    timeLine: TimelineLite,
    target: PIXI.Container,
    map: MapData,
    lastPosition: Point,
  ) => Point;
}

const baseMovement = {
  ease: Power0.easeNone
};

const SPEED: number = .62;

const MOVES: MoveCommands = {
  [Action.UP]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
    const newPosition = {
      ...baseMovement,
      ...lastPosition,
      y: lastPosition.y -= map.tileHeight,
    };

    timeLine.to(
      target,
      SPEED,
      newPosition,
    );
    return newPosition;
  },

  [Action.DOWN]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
    const newPosition = {
      ...baseMovement,
      ...lastPosition,
      y: lastPosition.y += map.tileHeight,
    };

    timeLine.to(
      target,
      SPEED,
      newPosition,
    );
    return newPosition;
  },
  [Action.LEFT]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
    const newPosition = {
      ...baseMovement,
      ...lastPosition,
      x: lastPosition.x -= map.tileWidth,
    };

    timeLine.to(
      target,
      SPEED,
      newPosition,
    );
    return newPosition;
  },
  [Action.RIGHT]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
    const newPosition = {
      ...baseMovement,
      ...lastPosition,
      x: lastPosition.x += map.tileWidth,
    };

    timeLine.to(
      target,
      SPEED,
      newPosition,
    );
    return newPosition;
  },
};

export default class Avatar extends PIXI.Sprite {
  private graphic: PIXI.Graphics = new PIXI.Graphics();

  constructor() {
    super();
    this.graphic.beginFill(0xFF0000, 0.8);
    this.graphic.drawRect(10, -20, 80, 120);
    this.addChild(this.graphic);
  }

  move(moves: Action[], rawMapData: MapData) {
    const timeLine = new TimelineLite();
    let positionAccumulator: Point = {x: this.x, y: this.y};
    moves.forEach((move) => {
      positionAccumulator = MOVES[move](timeLine, this, rawMapData, positionAccumulator);
    });
  }
}