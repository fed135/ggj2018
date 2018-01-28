import {Power0, TimelineLite} from 'gsap';
import {MapData} from "./map/Map";

export enum Action {
  UP = 'top',
  DOWN = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}


type Point = {
  x: number,
  y: number,
}

type Step = (
  timeLine: TimelineLite,
  target: PIXI.Container,
  map: MapData,
  lastPosition: Point,
) => Point;

type MoveCommands = {
  [move: string]: Step,
}

const baseMovement = {
  ease: Power0.easeNone
};

const SPEED: number = .62;

type StepValidator = (
  timeLine: TimelineLite,
  target: PIXI.Container,
  map: MapData,
  lastPosition: Point,
  step: Step,
) => void;


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

export const moveAvatar = (target: PIXI.Container, moves: Action[], rawMapData: MapData) => {
  const timeLine = new TimelineLite();
  let positionAccumulator: Point = {x: target.x, y: target.y};
  moves.forEach((move) => {
    positionAccumulator = MOVES[move](timeLine, target, rawMapData, positionAccumulator);
  });
};

