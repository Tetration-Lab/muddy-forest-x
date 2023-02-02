import Phaser from 'phaser'
export class Tile extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y)
    this.scene = scene
    this.scene.add.existing(this)
    const sprite = this.scene.add.sprite(0, 0, key).setOrigin(0)
    this.add(sprite)
  }
}
