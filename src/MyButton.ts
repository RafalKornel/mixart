import Phaser from "phaser";

export class MyButton extends Phaser.GameObjects.Ellipse {
  private _isDown: boolean;
  private _onPressed?: Function;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    onPressed: Function
  ) {
    super(scene, x, y, radius, radius, 0xffffff);

    this.setInteractive();
    this._isDown = false;

    this._onPressed = onPressed;
    // this.onReleased = null;

    this.on("pointerdown", () => {
      this._isDown = true;
    });
    // this.on("pointerup", () => {
    //   this.pointerUp();
    // });
    // this.on("pointerout", () => {
    //   this.pointerUp();
    // });
  }

  // pointerUp() {
  //   this._isDown = false;
  //   if (this.onReleased != null) this.onReleased();
  // }

  update() {
    if (this._isDown && !!this._onPressed) this._onPressed();
  }
}
