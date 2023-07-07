import Phaser from "phaser";

import { backgroundTiles, gameSettings } from "./shared";
import { ParallaxBackground } from "./ParallaxBackground";
import { Cat, CatState } from "./Cat";

import "./style.css";
import { Flower } from "./Flower";

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
    this.load.spritesheet(CatState.Idle1, `assets/cat/${CatState.Idle1}.png`, {
      frameWidth: 12,
      frameHeight: 12,
    });

    this.load.spritesheet(CatState.Tap, `assets/cat/${CatState.Tap}.png`, {
      frameWidth: 15,
      frameHeight: 12,
    });

    this.load.spritesheet(CatState.Run, `assets/cat/${CatState.Run}.png`, {
      frameWidth: 17,
      frameHeight: 13,
    });

    this.load.spritesheet(CatState.Jump, `assets/cat/${CatState.Jump}.png`, {
      frameWidth: 16,
      frameHeight: 18,
    });

    this.load.spritesheet(CatState.Spine, `assets/cat/${CatState.Spine}.png`, {
      frameWidth: 18,
      frameHeight: 11,
    });

    this.load.image("terrain", "assets/terrain/tileset.png");
    this.load.image("kings", "assets/terrain/kings.png");
    this.load.image("furniture", "assets/terrain/furniture.png");
    this.load.image("props", "assets/terrain/props.png");

    this.load.tilemapTiledJSON("map", "assets/terrain/terrain.json");

    this.load.image(
      "forest-background",
      "assets/background/forest-background.png"
    );

    backgroundTiles.forEach((tile) => {
      this.load.image(tile, `assets/Sunset/${tile}.png`);
    });

    // this.load.image(
    //   BackgroundTile.Background,
    //   "assets/background/parallax-mountain-bg.png"
    // );
    // this.load.image(
    //   BackgroundTile.Far,
    //   "assets/background/parallax-mountain-far.png"
    // );
    // this.load.image(
    //   BackgroundTile.Close,
    //   "assets/background/parallax-mountain-mountains.png"
    // );

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
    // const background = this.add.image(-22, 0, "forest-background");
    // background.setScrollFactor(0);
    // background.setOrigin(0, 0);

    this._parallax = new ParallaxBackground(this, backgroundTiles);

    const map = this.make.tilemap({
      key: "map",
      tileHeight: 16,
      tileWidth: 16,
    });

    const terrainTileset = map.addTilesetImage("terrain")!;
    const kingsTileset = map.addTilesetImage("kings")!;
    const furnitureTileset = map.addTilesetImage("furniture")!;
    const propsTileset = map.addTilesetImage("props")!;

    const tilesets = [
      terrainTileset,
      kingsTileset,
      furnitureTileset,
      propsTileset,
    ];

    const groundLayer = map.createLayer("ground", tilesets, 0, 0)!;

    const backgroundLayer = map.createLayer("background", tilesets, 0, 0)!;

    const platformsLayer = map.createLayer("platforms", tilesets, 0, 0)!;

    const furnitureLayer = map.createLayer("furniture", tilesets, 0, 0)!;

    groundLayer.setCollisionByExclusion([-1], true);
    platformsLayer.setCollisionByExclusion([-1], true);

    this.matter.world.convertTilemapLayer(groundLayer);
    this.matter.world.convertTilemapLayer(platformsLayer);

    const GROUND_LEVEL = 12;

    this._cat = new Cat(
      this,
      40 * gameSettings.tileWidth,
      GROUND_LEVEL * gameSettings.tileWidth
    );

    this._cursorKeys = this.input.keyboard?.createCursorKeys();

    // [47, 6]
    const FIRST_SHELF = { x: 50, y: 6 };
    const SECOND_SHELF = { x: 45, y: 3 };

    const flowers1 = [1, 2, 3, 4, 5, 6].map(
      (i) =>
        new Flower(
          this,
          (FIRST_SHELF.x + i * 2) * gameSettings.tileWidth,
          FIRST_SHELF.y * gameSettings.tileWidth,
          `flower${i}`
        )
    );

    const flowers2 = [1, 2, 3, 4, 5, 6].map(
      (i) =>
        new Flower(
          this,
          (SECOND_SHELF.x + i * 2) * gameSettings.tileWidth,
          SECOND_SHELF.y * gameSettings.tileWidth,
          `flower${i}`
        )
    );

    this._flowers = [...flowers1, ...flowers2];

    this.cameras.main.startFollow(
      this._cat,
      undefined,
      0.2,
      0.2,
      undefined,
      gameSettings.height / 4
    );

    this.cameras.main.setBounds(0, 0, 1920, 240);
  }

  movePlayerManager() {
    if (!this._cursorKeys) return;

    if (this._cursorKeys.up.isDown) {
      this._cat.jumpHandler();
    }

    if (this._cursorKeys.left.isDown) {
      this._cat.moveLeftHandler(-gameSettings.playerSpeed);
    } else if (this._cursorKeys.right.isDown) {
      this._cat.moveRightHandler(gameSettings.playerSpeed);
    }

    if (this._cursorKeys.space.isDown) {
      this._cat.attackHandler(this._flowers);
    }

    if (this._cursorKeys.down.isDown) {
      this._cat.spineHandler();
    }

    if (
      this._cursorKeys.left.isUp &&
      this._cursorKeys.right.isUp &&
      this._cat.catState === CatState.Run
    ) {
      this._cat.idleHandler();
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
    matter: {
      debug: true,
    },
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
