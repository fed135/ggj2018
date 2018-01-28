import config from './config';
import {EventEmitter} from 'events';

export default class InputAccumulator {

  public list = [];
  public numMovesLeft = config.playsPerTurn;
  private numPlayers = 0;
  private color = 0;
  private inputManager = null;

  constructor(match, inputManager: EventEmitter) {
    this.numPlayers = match.players;
    this.color = match.color;
    this.inputManager = inputManager;
  }

  push(action) {
    if (this.color === action.color) {
      // Local
      if (this.numMovesLeft > 0) {
        this.numMovesLeft--;
        const move = {
          direction: action.direction,
          color: this.color,
          time: Date.now()
        };
        this.list.push(move);
        this.inputManager.emit('moveAccepted', {
          numMovesLeft: this.numMovesLeft,
          move
        });
      }
    }
    else {
      // Remote
      this.list.push(action);
      this.list.sort((a, b) => {
        return Number(a.time) - Number(b.time);
      });
    }

    // Check game completed
    if (this.list.length === config.playsPerTurn * this.numPlayers) {
      this.inputManager.emit('movesAllAccepted', {list: this.list});
    }
  }
}