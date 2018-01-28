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
        const hudRatio = (window.innerHeight / 400);
        const uiSize = 210 * hudRatio;
        
        // Color
        this.box.beginFill(0xDDDDDD, 0.8);
        
        this.box.drawRect(0,0,uiSize,window.innerHeight);
        this.box.endFill();

        this.box.width = uiSize;
        this.box.height = window.innerHeight;

        // Arrows
        this.inputs = {
            top: new ArrowButton(this.box, Action.UP, hudRatio, inputManager),
            left: new ArrowButton(this.box, Action.LEFT, hudRatio, inputManager),
            right: new ArrowButton(this.box, Action.RIGHT, hudRatio, inputManager),
            bottom: new ArrowButton(this.box, Action.DOWN, hudRatio, inputManager)
        };

        // Move boxes
        this.moves.length = config.playsPerTurn;
        for (let i = 0; i<config.playsPerTurn; i++) {
            this.moves[i] = new MoveIndicator(this.box, i, hudRatio, inputManager);
        }

        // Add wrapper
        container.addChild(this.box);
    }
}