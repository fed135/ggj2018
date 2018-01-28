export enum Action {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const moves = {
  [Action.UP]: (target: PIXI.Container) => {

  },
  [Action.DOWN]: (target: PIXI.Container) => {

  },
  [Action.LEFT]: (target: PIXI.Container) => {

  },
  [Action.RIGHT]: (target: PIXI.Container) => {

  },
};

export default class Avatar extends PIXI.Sprite {
  move(moves: Action[]) {


  }
}