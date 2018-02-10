import {Power0, TimelineLite} from 'gsap';
import {MapData} from "./map/MapParser";
import {Input} from "../server/player/types";


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
    [Input.UP]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
      const newPosition = Object.assign(
        {},
        baseMovement,
        lastPosition,
        {
          y: lastPosition.y -= map.tileHeight,
        }
      );

      timeLine.to(
        target,
        SPEED,
        newPosition,
      );
      return newPosition;
    },

    [Input.DOWN]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
      const newPosition = Object.assign(
        {},
        baseMovement,
        lastPosition,
        {
          y: lastPosition.y += map.tileHeight,
        }
      );

      timeLine.to(
        target,
        SPEED,
        newPosition,
      );
      return newPosition;
    },

    [Input.LEFT]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
      const newPosition = Object.assign(
        {},
        baseMovement,
        lastPosition,
        {
          x: lastPosition.x -= map.tileWidth,
        }
      );

      timeLine.to(
        target,
        SPEED,
        newPosition,
      );
      return newPosition;
    },

    [Input.RIGHT]: (timeLine: TimelineLite, target: PIXI.Container, map: MapData, lastPosition: Point): Point => {
      const newPosition = Object.assign(
        {},
        baseMovement,
        lastPosition,
        {
          x: lastPosition.x += map.tileWidth,
        }
      );

      timeLine.to(
        target,
        SPEED,
        newPosition,
      );
      return newPosition;
    },
  }
;

export const moveAvatar = (target: PIXI.Container, moves: Input[], rawMapData: MapData) => {
  const timeLine = new TimelineLite();
  let positionAccumulator: Point = {x: target.x, y: target.y};
  moves.forEach((move) => {
    positionAccumulator = MOVES[move](timeLine, target, rawMapData, positionAccumulator);
  });
};

