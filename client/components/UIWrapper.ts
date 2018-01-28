import * as PIXI from 'pixi.js';
import ArrowButton from './ArrowButton';
import { EventEmitter } from 'events';

export default class UIWrapper {

    private box = new PIXI.Graphics();

    public inputs = {
        top: null,
        left: null,
        right: null,
        bottom: null,
    };

    constructor(container: PIXI.Container, inputManager: EventEmitter) {
        const uiSize = 0.16;
        
        // Color
        this.box.beginFill(0xDDDDDD, 0.8);
        
        this.box.drawRect(0,0,container.width * uiSize,container.height);
        this.box.endFill();

        this.box.width = container.width * uiSize;

        // Arrows
        this.inputs = {
            top: new ArrowButton(this.box, 'top', inputManager),
            left: new ArrowButton(this.box, 'left', inputManager),
            right: new ArrowButton(this.box, 'right', inputManager),
            bottom: new ArrowButton(this.box, 'bottom', inputManager)
        };

        // Add wrapper
        container.addChild(this.box);
    }
}