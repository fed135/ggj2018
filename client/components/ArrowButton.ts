import * as PIXI from 'pixi.js';
import {EventEmitter} from 'events';

export default class ArrowButton {

  private box = new PIXI.Graphics();

  constructor(container: PIXI.Container, direction: string, inputDispatcher: EventEmitter) {

    const positions = {
      top: [80, 240, 0],
      left: [30, 290, Math.PI * 1.5],
      right: [130, 290, Math.PI * 0.5],
      bottom: [80, 340, Math.PI]
    };

    const buttonSize = 50;
    const arrowSize = 15;

    // Color
    this.box.lineStyle(2, 0x000000, 1);
    this.box.beginFill(0xFFFFFF, 1);

    this.box.drawRect(
      positions[direction][0],
      positions[direction][1],
      buttonSize,
      buttonSize,
    );
    this.box.endFill();

    // Interactivity
    this.box.interactive = true;
    this.box.buttonMode = true;
    this.box.on('pointerdown', inputDispatcher.emit.bind(inputDispatcher, 'input', {direction}));

    // Arrow graphics
    const arrowGraphics = new PIXI.Graphics();
    arrowGraphics.beginFill(0x333333, 0.8);
    arrowGraphics.moveTo(0, -arrowSize);
    arrowGraphics.lineTo(arrowSize, arrowSize);
    arrowGraphics.lineTo(-arrowSize, arrowSize);
    arrowGraphics.endFill();
    arrowGraphics.rotation = positions[direction][2];
    arrowGraphics.x = (positions[direction][0]) + ((buttonSize) * 0.5);
    arrowGraphics.y = (positions[direction][1]) + ((buttonSize) * 0.5);
    this.box.addChild(arrowGraphics);

    // Add wrapper
    container.addChild(this.box);
  }

}