import * as PIXI from 'pixi.js';
import ArrowButton from './ArrowButton';
import MoveIndicator from './MoveIndicator';
import {EventEmitter} from 'events';
import config from '../config';
import {Action} from "../Step";

export default class UIWrapper extends PIXI.Sprite {

  private box = new PIXI.Graphics();

  public inputs = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  };

  public moves = [];

  constructor(ratio: number, inputManager: EventEmitter) {
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
      top: new ArrowButton(this.box, Action.UP, inputManager),
      left: new ArrowButton(this.box, Action.LEFT, inputManager),
      right: new ArrowButton(this.box, Action.RIGHT, inputManager),
      bottom: new ArrowButton(this.box, Action.DOWN, inputManager)
    };

    // Move boxes
    this.moves.length = config.playsPerTurn;
    for (let i = 0; i < config.playsPerTurn; i++) {
      const move = new MoveIndicator(ratio, i, inputManager);
      this.moves[i] = move;
      this.box.addChild(move);
    }

    // Add wrapper
    this.addChild(this.box);
  }
}