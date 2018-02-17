import * as PIXI from 'pixi.js';
import ArrowButton from './ArrowButton';
import MoveIndicator from './MoveIndicator';
import {EventEmitter} from 'events';
import config from '../config';
import {Input} from "../../server/player/types";

export default class UIWrapper extends PIXI.Sprite {

  private box = new PIXI.Graphics();

  public inputs = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  };

  public moves = [];

  constructor(ratio: number, inputDispatcher: EventEmitter) {
    super();

    const uiSize = 210;

    // Color
    this.box.beginFill(0xDDDDDD, 0.8);

    this.box.drawRect(0, 0, uiSize, window.innerHeight);
    this.box.endFill();

    this.box.width = uiSize*ratio;
    this.box.height = window.innerHeight;

    // Arrows
    this.inputs = {
      top: new ArrowButton(this.box, Input.UP, inputDispatcher),
      left: new ArrowButton(this.box, Input.LEFT, inputDispatcher),
      right: new ArrowButton(this.box, Input.RIGHT, inputDispatcher),
      bottom: new ArrowButton(this.box, Input.DOWN, inputDispatcher)
    };

    // Move boxes
    this.moves.length = config.playsPerTurn;
    for (let i = 0; i < config.playsPerTurn; i++) {
      const move = new MoveIndicator(ratio, i, inputDispatcher);
      this.moves[i] = move;
      this.box.addChild(move);
    }

    // Add wrapper
    this.addChild(this.box);
  }
}