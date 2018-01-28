import {TimelineLite, Power0} from 'gsap';
import {MapData} from "./map/MapParser";

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


// DPL commented so it wont break the build if commited. Delete this code if you can read this.
// const validationSteps: StepValidator[] = [];
// export const stepBusinessLogic = (
//   timeLine: TimelineLite,
//   target: PIXI.Container,
//   map: MapData,
//   lastPosition: Point,
//   step: Step
// ) => {
//   validationSteps.forEach((validation) => validation(
//     timeLine,
//     target,
//     map,
//     lastPosition,
//     step,
//   ));
// };

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
