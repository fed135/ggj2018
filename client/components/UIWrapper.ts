import * as PIXI from 'pixi.js';
import ArrowButton from './ArrowButton';
import MoveIndicator from './MoveIndicator';
import {Action} from "../components/Avatar";
import { EventEmitter } from 'events';
import config from '../config';

export default class UIWrapper {

    private box = new PIXI.Graphics();

    public inputs = {
        top: null,
        left: null,
        right: null,
        bottom: null,
    };

    public moves = [];

    constructor(container: PIXI.Container, inputManager: EventEmitter) {
        const uiSize = 0.16;
        
        // Color
        this.box.beginFill(0xDDDDDD, 0.8);
        
        this.box.drawRect(0,0,container.width * uiSize,container.height);
        this.box.endFill();

        this.box.width = container.width * uiSize;

        // Arrows
        this.inputs = {
            top: new ArrowButton(this.box, Action.UP, inputManager),
            left: new ArrowButton(this.box, Action.LEFT, inputManager),
            right: new ArrowButton(this.box, Action.RIGHT, inputManager),
            bottom: new ArrowButton(this.box, Action.DOWN, inputManager)
        };

        // Move boxes
        this.moves.length = config.playsPerTurn;
        for (let i = 0; i<config.playsPerTurn; i++) {
            this.moves[i] = new MoveIndicator(this.box, i, inputManager);
        }

        // Add wrapper
        container.addChild(this.box);
    }
}