import * as PIXI from 'pixi.js';
import Net from '../../extras/system/Net';
import { EventEmitter } from 'events';

export default class ArrowButton {

    private box = new PIXI.Graphics(); 

    constructor(container: PIXI.Container, direction: string, inputManager: EventEmitter) {

        const positions = {
            top: [0.4, 0.1, 0],
            left: [0.1, 0.4, Math.PI * 1.5],
            right: [0.7, 0.4, Math.PI * 0.5],
            bottom: [0.4, 0.7, Math.PI]
        };

        const buttonSize = 0.16;

        // Color
        this.box.lineStyle(2, 0x000000, 1);
        this.box.beginFill(0xFFFFFF, 1);
        
        this.box.drawRect(
            container.width * positions[direction][0],
            container.width * positions[direction][1],
            container.width * buttonSize,
            container.width * buttonSize
        );
        this.box.endFill();

        // Interactivity
        this.box.interactive = true;
        this.box.buttonMode = true;
        this.box.on('pointerdown', inputManager.emit.bind(inputManager, 'input', { direction }));

        // Arrow graphics
        const arrowGraphics = new PIXI.Graphics();
        arrowGraphics.beginFill(0x333333, 0.8);
        arrowGraphics.moveTo(0, -container.width * 0.05);
        arrowGraphics.lineTo(container.width * 0.05, container.width * 0.05);
        arrowGraphics.lineTo(-container.width * 0.05, container.width * 0.05);
        arrowGraphics.endFill();
        arrowGraphics.rotation = positions[direction][2];
        arrowGraphics.x = container.width * positions[direction][0] + container.width * (buttonSize * 0.5);
        arrowGraphics.y = container.width * positions[direction][1] + container.width * (buttonSize * 0.5);
        this.box.addChild(arrowGraphics);

        // Add wrapper
        container.addChild(this.box);
    }

}