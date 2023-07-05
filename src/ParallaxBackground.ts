import { BackgroundTile } from "./shared";
import Phaser from "phaser";

export class ParallaxBackground extends Phaser.GameObjects.Group {
  private _bg: Phaser.GameObjects.TileSprite;
  private _far: Phaser.GameObjects.TileSprite;
  private _close: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene) {
    const bg = scene.add.tileSprite(
      0,
      0,
      Number(scene.game.config.width),
      Number(scene.game.config.height),
      BackgroundTile.Background
    );
    bg.setOrigin(0, 0);
    bg.setScrollFactor(0);

    const far = scene.add.tileSprite(
      0,
      0,
      Number(scene.game.config.width),
      Number(scene.game.config.height),
      BackgroundTile.Far
    );
    far.setOrigin(0, 0);
    far.setScrollFactor(0);

    const close = scene.add.tileSprite(
      0,
      0,
      Number(scene.game.config.width),
      Number(scene.game.config.height),
      BackgroundTile.Close
    );
    close.setOrigin(0, 0);
    close.setScrollFactor(0);

    super(scene, [bg, far, close]);

    scene.add.existing(this);

    this._bg = bg;
    this._close = close;
    this._far = far;
  }

  public updateBackgroundPosition(camera: Phaser.Cameras.Scene2D.Camera) {
    this._far.tilePositionX = camera.scrollX * 0.4;
    this._close.tilePositionX = camera.scrollX * 0.6;
  }
}
