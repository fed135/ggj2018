import * as PIXI from 'pixi.js';
import { EventEmitter } from 'events';
import config from '../config';

export default class MoveIndicator {

    private box = new PIXI.Graphics(); 

    constructor(container: PIXI.Container, index: number, inputManager: EventEmitter) {

        const boxSize = (0.85 / config.playsPerTurn);

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
            container.width * 0.075 + ((container.width * boxSize) * index),
            container.width * 1.125,
            container.width * boxSize,
            container.width * boxSize,
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
                arrowGraphics.moveTo(0, -container.width * 0.05);
                arrowGraphics.lineTo(container.width * 0.05, container.width * 0.05);
                arrowGraphics.lineTo(-container.width * 0.05, container.width * 0.05);
                arrowGraphics.endFill();
                arrowGraphics.rotation = positions[action.move.direction];
                arrowGraphics.x = container.width * 0.075 + ((container.width * boxSize) * index) + container.width * (boxSize * 0.5);
                arrowGraphics.y = container.width * 1.125 + container.width * (boxSize * 0.5);
                this.box.addChild(arrowGraphics);
            }
        });

        // Add wrapper
        container.addChild(this.box);
    }

}