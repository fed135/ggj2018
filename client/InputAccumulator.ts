import config from './config';
import {EventEmitter} from 'events';
import MatchStore from "./match/Store";

export default class InputAccumulator {

  public list = [];
  public numMovesLeft = config.playsPerTurn;
  private numPlayers = 0;
  private color = 0;

  constructor(matchStore: MatchStore, private inputDispatcher: EventEmitter) {
    this.numPlayers = matchStore.getPlayers().length;
    this.color = matchStore.getSelf().color;
  }

  public push(action): void {
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
        this.inputDispatcher.emit('moveAccepted', {
          numMovesLeft: this.numMovesLeft,
          move
        });
      }
    } else {
      // Remote
      this.list.push(action);
      this.list.sort((a, b) => {
        return Number(a.time) - Number(b.time);
      });
    }

    // Check game completed
    if (this.list.length === config.playsPerTurn * this.numPlayers) {
      this.inputDispatcher.emit('movesAllAccepted', {list: this.list});
    }
  }
}