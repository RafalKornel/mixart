import Phaser from "phaser";

export class Flower extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture, undefined, {
      mass: 1,
    });

    scene.add.existing(this);

    // scene.events.on("update", this.update, this);
  }

  update() {
    if (this.angle !== 0) {
      console.log(this.angle);
    }
  }
}
