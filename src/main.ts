import Phaser from "phaser";

import { BackgroundTile } from "./shared";
import { ParallaxBackground } from "./ParallaxBackground";
import { Cat } from "./Cat";

import "./style.css";
import { Flower } from "./Flower";

const gameSettings = {
  playerSpeed: 1,
  width: 320,
  height: 240,
};

enum Scene {
  Example = "exampleScene",
}

class Example extends Phaser.Scene {
  private _cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private _cat!: Cat;
  private _parallax!: ParallaxBackground;
  private _flowers!: Flower[];

  constructor() {
    super(Scene.Example);
  }

  preload() {
    this.load.spritesheet("idle", "assets/idle.png", {
      frameWidth: 12,
      frameHeight: 12,
    });

    this.load.image("block", "assets/block.png");
    this.load.image("platform", "assets/platform.png");

    this.load.image(
      BackgroundTile.Background,
      "assets/background/parallax-mountain-bg.png"
    );
    this.load.image(
      BackgroundTile.Far,
      "assets/background/parallax-mountain-far.png"
    );
    this.load.image(
      BackgroundTile.Close,
      "assets/background/parallax-mountain-mountains.png"
    );

    this.load.image(
      "bg_3",
      "assets/background/parallax-mountain-foreground-trees.png"
    );
    this.load.image("bg_5", "assets/background/parallax-trees.png");

    this.load.image("armchair", "assets/armchair.png");

    [1, 2, 3, 4, 5, 6].forEach((i) => {
      this.load.image(`flower${i}`, `assets/flowers/flower${i}.png`);
    });
  }

  create() {
    this._parallax = new ParallaxBackground(this);

    this._cat = new Cat(this, 10, 10, "idle");

    this._cursorKeys = this.input.keyboard?.createCursorKeys();

    const ground = this.matter.add.image(100, 240, "platform", undefined, {
      isStatic: true,
      friction: 0,
    });

    // const flowers = this.add.group();

    this._flowers = [1, 2, 3, 4, 5, 6].map(
      (i) => new Flower(this, 50 * i, 10, `flower${i}`)
      // const flower = this.matter.add.image(50 * i, 10, `flower${i}`);

      // flowers.add(flower);
    );

    // ground.scaleY = 2;

    this.cameras.main.startFollow(
      this._cat,
      undefined,
      0.2,
      0.2,
      undefined,
      gameSettings.height / 4
    );
  }

  movePlayerManager() {
    if (!this._cursorKeys) return;

    if (this._cursorKeys.left.isDown) {
      this._cat.setVelocityX(-gameSettings.playerSpeed);
      this._cat.setFlipX(true);
    } else if (this._cursorKeys.right.isDown) {
      this._cat.setVelocityX(gameSettings.playerSpeed);
      this._cat.setFlipX(false);
    }

    if (this._cursorKeys.up.isDown && this._cat.isTouchingGround) {
      this._cat.isTouchingGround = false;
      this._cat.applyForce(new Phaser.Math.Vector2(0, -0.02));
    }

    if (this._cursorKeys.space.isDown) {
      this._cat.attack(this._flowers);
    }
  }

  update() {
    this.movePlayerManager();
    this._parallax.updateBackgroundPosition(this.cameras.main);
  }
}

const config = {
  type: Phaser.AUTO,
  width: gameSettings.width,
  height: gameSettings.height,
  backgroundColor: "#000",
  parent: "phaser-example",
  pixelArt: true,
  zoom: window.innerHeight / gameSettings.height,
  physics: {
    default: "matter",
    matter: {},
  },
  scene: [Example],
};

const game = new Phaser.Game(config);

// game.start();

// html`
//   <select
//     @change="${(e: any) => {
//       const v = Number(e.target.value);

//       if (!isNaN(v) && CAT_STATE_VALUES.includes(v)) {
//         game.changeCatState(v);
//       }
//     }}"
//   >
//     ${CAT_STATE_KEYS.map(
//       (key, value) =>
//         html`<option value="${CAT_STATE_VALUES[value]}">${key}</option>`
//     )}
//   </select>
// `(document.querySelector("#animation-select")!);
