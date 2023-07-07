import Phaser from "phaser";
import { Flower } from "./Flower";
import { gameSettings } from "./shared";

export enum CatState {
  Idle1 = "Idle1",
  Idle2 = "Idle2",
  LickPaw = "LickPaw",
  Scratch = "Scratch",
  Walk = "Walk",
  Run = "Run",
  Sleep = "Sleep",
  Tap = "Tap",
  Jump = "Jump",
  Spine = "Spine",
}

const INITIAL_STATE = CatState.Idle1;

const getAnimKeyForState = (state: CatState): string => `${state}_anim`;

export class Cat extends Phaser.Physics.Matter.Sprite {
  static SIZE = 12;
  static ATTACT_MIN_DIST = 1.5;

  private _collision?: Phaser.Types.Physics.Matter.MatterCollisionData;
  private _catState: CatState;
  private _currentAnimation: Phaser.GameObjects.GameObject;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, CatState.Idle1, undefined, {
      circleRadius: Cat.SIZE / 2,
      friction: gameSettings.catFriction,
      frictionAir: gameSettings.catFrictionAir,
      mass: gameSettings.catMass,
    });

    scene.add.existing(this);

    this.setFixedRotation();

    this.registerAnimations();

    this._catState = INITIAL_STATE;

    this._currentAnimation = this.anims.play(getAnimKeyForState(INITIAL_STATE));

    this.handleCollision = this.handleCollision.bind(this);

    this.setOnCollideActive(this.handleCollision);

    this.setOnCollideEnd(() => {
      this._collision = undefined;
    });

    scene.events.on("update", this.update, this);
  }

  handleCollision({
    collision,
  }: {
    collision: Phaser.Types.Physics.Matter.MatterCollisionData;
  }) {
    this._collision = collision;
  }

  registerAnimations() {
    this.anims.create({
      key: getAnimKeyForState(CatState.Idle1),
      frames: this.anims.generateFrameNumbers(CatState.Idle1),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: getAnimKeyForState(CatState.Run),
      frames: this.anims.generateFrameNumbers(CatState.Run),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: getAnimKeyForState(CatState.Tap),
      frames: this.anims.generateFrameNumbers(CatState.Tap),
      frameRate: 10,
      repeat: 0,
      yoyo: true,
    });

    this.anims.create({
      key: getAnimKeyForState(CatState.Spine),
      frames: this.anims.generateFrameNumbers(CatState.Spine),
      frameRate: 10,
      repeat: 0,
    });

    this.anims.create({
      key: getAnimKeyForState(CatState.Jump),
      frames: this.anims.generateFrameNumbers(CatState.Jump),
      frameRate: 11,
      repeat: 0,
    });
  }

  applyForceToClosestFlower(flowers: Flower[]) {
    let smallestDist = 99999999,
      indexOfClosest = 0;

    flowers.forEach((flower, i) => {
      const dist = Phaser.Math.Distance.BetweenPoints(this, flower);

      if (smallestDist > dist) {
        smallestDist = dist;
        indexOfClosest = i;
      }
    });

    if (smallestDist <= Cat.SIZE * Cat.ATTACT_MIN_DIST) {
      const flower = flowers[indexOfClosest];

      flower.applyForce(
        new Phaser.Math.Vector2(0, Phaser.Math.FloatBetween(0.5, 1)).scale(
          gameSettings.attackForce
        )
      );
    }
  }

  attackHandler(flowers: Flower[]) {
    if (this._catState !== CatState.Idle1) return;

    this.changeState(CatState.Tap);

    const attackAnimationKey = getAnimKeyForState(CatState.Tap);

    this._currentAnimation = this.anims.play(attackAnimationKey);

    this._currentAnimation.off("animationupdate");

    this._currentAnimation.on(
      "animationupdate",
      (
        animation: Phaser.Animations.Animation,
        frame: Phaser.Animations.AnimationFrame
      ) => {
        if (animation.key === attackAnimationKey && frame.index === 4) {
          this.applyForceToClosestFlower(flowers);
        }
      }
    );

    this._currentAnimation.off("animationcomplete");

    this._currentAnimation.on("animationcomplete", () => {
      this.changeState(CatState.Idle1);
      this.anims.play(getAnimKeyForState(CatState.Idle1));
    });
  }

  changeState(state: CatState) {
    this._catState = state;
  }

  moveLeftHandler(playerSpeed: number) {
    if (
      this._catState === CatState.Jump &&
      this._collision &&
      this._collision.normal.x !== 0
    ) {
      return;
    }
    this.setVelocityX(playerSpeed);

    this.setFlipX(true);

    if (this._catState === CatState.Run || this._catState === CatState.Jump)
      return;

    this.changeState(CatState.Run);

    const runAnimationKey = getAnimKeyForState(CatState.Run);

    this._currentAnimation = this.anims.play(runAnimationKey);
  }

  moveRightHandler(playerSpeed: number) {
    if (
      this._catState === CatState.Jump &&
      this._collision &&
      this._collision.normal.x !== 0
    ) {
      return;
    }
    this.setVelocityX(playerSpeed);

    this.setFlipX(false);

    if (this._catState === CatState.Run || this._catState === CatState.Jump)
      return;

    this.changeState(CatState.Run);

    const runAnimationKey = getAnimKeyForState(CatState.Run);

    this._currentAnimation = this.anims.play(runAnimationKey);
  }

  idleHandler() {
    this.changeState(CatState.Idle1);

    const idleAnimation = getAnimKeyForState(CatState.Idle1);

    this._currentAnimation = this.anims.play(idleAnimation);
  }

  jumpHandler() {
    if (this._catState === CatState.Jump) return;

    this.changeState(CatState.Jump);

    const jumpAnimationKey = getAnimKeyForState(CatState.Jump);

    this._currentAnimation = this.anims.play(jumpAnimationKey);

    this._currentAnimation.off("animationcomplete");

    this._currentAnimation.on("animationcomplete", () => {
      this.changeState(CatState.Idle1);
      this.anims.play(getAnimKeyForState(CatState.Idle1));
    });

    this.applyForce(new Phaser.Math.Vector2(0, gameSettings.jumpForce));
  }

  spineHandler() {
    if (this._catState !== CatState.Idle1) return;

    this.changeState(CatState.Spine);

    const spineAnimation = getAnimKeyForState(CatState.Spine);

    this._currentAnimation = this.anims.play(spineAnimation);

    this._currentAnimation.off("animationcomplete");

    this._currentAnimation.on("animationcomplete", () => {
      this.changeState(CatState.Idle1);
      this.anims.play(getAnimKeyForState(CatState.Idle1));
    });
  }

  get catState() {
    return this._catState;
  }
}
