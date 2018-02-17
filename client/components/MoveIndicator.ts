import * as PIXI from 'pixi.js';
import {EventEmitter} from 'events';
import config from '../config';

export default class MoveIndicator extends PIXI.Sprite {

  private box = new PIXI.Graphics();

  constructor(ratio: number, index: number, inputDispatcher: EventEmitter) {
    super();

    const moveBoxSize = 190;
    const movesPerRow = 4;
    const boxSize = (moveBoxSize / movesPerRow);
    const arrowSize = boxSize * 0.25;

    const positions = {
      top: 0,
      left: Math.PI * 1.5,
      right: Math.PI * 0.5,
      bottom: Math.PI
    };

    // Color
    this.box.lineStyle(2, 0x000000, 1);
    this.box.beginFill(0xFFFFFF, 1);
    this.box.alpha = 0.44;

    this.box.drawRoundedRect(
      (10) + ((boxSize) * (index % movesPerRow)),
      (50) + ((boxSize) * Math.floor(index / movesPerRow)),
      boxSize,
      boxSize,
      8
    );
    this.box.endFill();

    // Lighting up
    inputDispatcher.on('moveAccepted', (action) => {
      if (index === (config.playsPerTurn - action.numMovesLeft) - 1) {
        this.box.alpha = 1;

        // Arrow graphics
        const arrowGraphics = new PIXI.Graphics();
        arrowGraphics.beginFill(0x333333, 0.8);
        arrowGraphics.moveTo(0, -arrowSize);
        arrowGraphics.lineTo(arrowSize, arrowSize);
        arrowGraphics.lineTo(-arrowSize, arrowSize);
        arrowGraphics.endFill();
        arrowGraphics.rotation = positions[action.move.direction];
        arrowGraphics.x = (10) + ((boxSize) * (index % movesPerRow)) + ((boxSize) * 0.5);
        arrowGraphics.y = (50) + ((boxSize) * Math.floor(index / movesPerRow)) + ((boxSize) * 0.5);
        this.box.addChild(arrowGraphics);
      }
    });

    // Add wrapper
    this.addChild(this.box);
  }

}