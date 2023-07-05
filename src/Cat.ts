import Phaser from "phaser";
import { Flower } from "./Flower";

export class Cat extends Phaser.Physics.Matter.Sprite {
  static SIZE = 12;
  static ATTACT_MIN_DIST = 1.5;
  private _isTouchingGround: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture, undefined, {
      friction: 0.5,
      mass: 1,
    });

    scene.add.existing(this);

    this.setFixedRotation();

    scene.anims.create({
      key: "idle_anim",
      frames: this.anims.generateFrameNumbers("idle"),
      frameRate: 10,
      repeat: -1,
    });

    this.play("idle_anim");

    this._isTouchingGround = false;

    this.setOnCollide(() => {
      this._isTouchingGround = true;
    });

    scene.events.on("update", this.update, this);
  }

  attack(flowers: Flower[]) {
    console.log("attacking!");

    let smallestDist = 99999999,
      indexOfClosest = 0;

    flowers.forEach((flower, i) => {
      console.log(flower.x, flower.y);
      const dist = Phaser.Math.Distance.BetweenPoints(this, flower);

      if (smallestDist > dist) {
        smallestDist = dist;
        indexOfClosest = i;
      }
    });

    console.log({ smallestDist, indexOfClosest });

    if (smallestDist <= Cat.SIZE * Cat.ATTACT_MIN_DIST) {
      const flower = flowers[indexOfClosest];

      const ATTACK_MODIFIER = -0.005;

      flower.applyForce(
        new Phaser.Math.Vector2(0, Phaser.Math.FloatBetween(0, 1)).scale(
          ATTACK_MODIFIER
        )
      );
    }
  }

  get isTouchingGround() {
    return this._isTouchingGround;
  }

  set isTouchingGround(val: boolean) {
    this._isTouchingGround = val;
  }
}
