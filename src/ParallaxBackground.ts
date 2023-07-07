import { BackgroundTile, gameSettings } from "./shared";
import Phaser from "phaser";

export class ParallaxBackground extends Phaser.GameObjects.Group {
  // private _bg: Phaser.GameObjects.TileSprite;
  // private _far: Phaser.GameObjects.TileSprite;
  // private _close: Phaser.GameObjects.TileSprite;

  private _layers: Phaser.GameObjects.TileSprite[];
  private _layersCount: number;

  constructor(scene: Phaser.Scene, layers: string[]) {
    const [background, ...rest] = layers;

    const spriteLayers = layers.map((layer, i) => {
      const sprite = scene.add.tileSprite(
        0,
        i === 0 ? 0 : 2 * gameSettings.tileWidth,
        Number(scene.game.config.width),
        Number(scene.game.config.height),
        layer
      );
      sprite.setOrigin(0, 0);
      sprite.setScrollFactor(0);

      return sprite;
    });

    super(scene, spriteLayers);

    this._layers = spriteLayers;
    this._layersCount = spriteLayers.length;

    scene.add.existing(this);

    // this._bg = bg;
    // this._close = close;
    // this._far = far;
  }

  public updateBackgroundPosition(camera: Phaser.Cameras.Scene2D.Camera) {
    this._layers.forEach((layer, index) => {
      const offset = index / this._layersCount;

      layer.tilePositionX = camera.scrollX * offset;
    });
    // this._far.tilePositionX = camera.scrollX * 0.4;
    // this._close.tilePositionX = camera.scrollX * 0.6;
  }
}
