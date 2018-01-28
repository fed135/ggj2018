


export default class Avatar extends PIXI.Sprite {
  private graphic: PIXI.Graphics = new PIXI.Graphics();

  constructor() {
    super();
    this.graphic.beginFill(0xFF0000, 0.8);
    this.graphic.drawRect(10, -20, 80, 120);
    this.addChild(this.graphic);
  }

}