export enum PlayerAction {
  INPUT = 'player.input',
}

export enum Input {
  UP = 'top',
  DOWN = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}


export type PlayerState = {
  id: string,
  color: number,
}