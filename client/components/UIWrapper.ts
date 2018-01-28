import * as PIXI from 'pixi.js';

export default class UIWrapper {

    constructor(container: PIXI.Container) {
        const box = new PIXI.Graphics();
        box.lineStyle(2, 0x0000FF, 1);
        box.beginFill(0xFF700B, 1);
        box.drawRect(100,100,100,100);
        box.endFill();

        container.addChild(box);
    }
}