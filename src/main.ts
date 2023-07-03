import "./style.css";
import Phaser from "phaser";

const gameSettings = {
  playerSpeed: 1,
};

enum Scene {
  Loading = "loadingScene",
  Example = "exampleScene",
}

class Cat extends Phaser.Physics.Matter.Sprite {
  private _isTouchingGround: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture, undefined, {
      friction: 0.5,
      mass: 1,
    });

    scene.add.existing(this);

    this.setFixedRotation();

    // const catSprite = scene.matter.add.sprite(10, 10, "idle", undefined, {});

    scene.anims.create({
      key: "idle_anim",
      frames: this.anims.generateFrameNumbers("idle"),
      frameRate: 10,
      repeat: -1,
    });

    this.play("idle_anim");

    this._isTouchingGround = false;

    scene.matter.world.on("collisionactive", () => {
      this._isTouchingGround = true;
    });

    scene.events.on("update", this.update, this);
  }

  get isTouchingGround() {
    return this._isTouchingGround;
  }

  set isTouchingGround(val: boolean) {
    this._isTouchingGround = val;
  }

  // update() {}
}

enum BackgroundTile {
  Background = "background",
  Far = "far",
  Close = "close",
}

class ParallaxBackground extends Phaser.GameObjects.Group {
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

    // scene.events.on("update", this.update, this);

    this._bg = bg;
    this._close = close;
    this._far = far;
  }

  public updateBackgroundPosition(camera: Phaser.Cameras.Scene2D.Camera) {
    this._far.tilePositionX = camera.scrollX * 0.4;
    this._close.tilePositionX = camera.scrollX * 0.6;
  }
}

class Example extends Phaser.Scene {
  private _cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  private _cat!: Cat;
  private _parallax!: ParallaxBackground;

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
  }

  create() {
    this._parallax = new ParallaxBackground(this);

    this._cat = new Cat(this, 10, 10, "idle");

    this._cursorKeys = this.input.keyboard?.createCursorKeys();

    const ground = this.matter.add.image(100, 240, "platform", undefined, {
      isStatic: true,
      friction: 0,
    });

    // ground.scaleY = 2;

    this.cameras.main.startFollow(this._cat, undefined, 0.2, 0.2, undefined, 30);
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
  }

  update() {
    this.movePlayerManager();
    this._parallax.updateBackgroundPosition(this.cameras.main);
  }
}

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 160,
  backgroundColor: "#000",
  parent: "phaser-example",
  pixelArt: true,
  zoom: 2,
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
