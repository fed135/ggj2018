import * as PIXI from 'pixi.js';
import {EventEmitter} from 'events';
import config from '../config';

export default class MoveIndicator {

  private box = new PIXI.Graphics();

  constructor(container: PIXI.Container, index: number, hudRatio: number, inputManager: EventEmitter) {

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
      (10 * hudRatio) + ((boxSize * hudRatio) * (index % movesPerRow)),
      (50 * hudRatio) + ((boxSize * hudRatio) * Math.floor(index / movesPerRow)),
      boxSize * hudRatio,
      boxSize * hudRatio,
      8
    );
    this.box.endFill();

    // Lighting up
    inputManager.on('moveAccepted', (action) => {
      if (index === (config.playsPerTurn - action.numMovesLeft) - 1) {
        this.box.alpha = 1;

        // Arrow graphics
        const arrowGraphics = new PIXI.Graphics();
        arrowGraphics.beginFill(0x333333, 0.8);
        arrowGraphics.moveTo(0, -arrowSize * hudRatio);
        arrowGraphics.lineTo(arrowSize * hudRatio, arrowSize * hudRatio);
        arrowGraphics.lineTo(-arrowSize * hudRatio, arrowSize * hudRatio);
        arrowGraphics.endFill();
        arrowGraphics.rotation = positions[action.move.direction];
        arrowGraphics.x = (10 * hudRatio) + ((boxSize * hudRatio) * (index % movesPerRow)) + ((boxSize * hudRatio) * 0.5);
        arrowGraphics.y = (50 * hudRatio) + ((boxSize * hudRatio) * Math.floor(index / movesPerRow)) + ((boxSize * hudRatio) * 0.5);
        this.box.addChild(arrowGraphics);
      }
    });

    // Add wrapper
    container.addChild(this.box);
  }

}