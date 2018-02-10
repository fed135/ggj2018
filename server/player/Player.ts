import {IConnection} from "../types";
import {Input, PlayerState} from "./types";

export default class Player {
  static maxMovePerTurn: number = 5;
  private matchName: string;
  private inputs: Input[] = [];

  public color: number;
  public getMatchName = () => this.matchName;
  public getId = (): string => this.connection.id;
  public getInputs = (): Input[] => this.inputs;


  constructor(public connection: IConnection) {

  }

  public join(matchName: string): void {
    this.matchName = matchName;
  }

  public parse(): PlayerState {
    return {
      id: this.getId(),
      color: this.color,
    }
  }

  public addInput(action: Input) {
    if (this.inputs.length < Player.maxMovePerTurn) {
      this.inputs = [
        ...this.inputs,
        action,
      ]
    }
  }

  public flushInput(): Input[] {
    const inputs = this.inputs;
    this.inputs = [];
    return inputs;
  }
}
