import Phaser from 'phaser'
import { TILE_SIZE } from '../config/chunk'
export class Tile extends Phaser.GameObjects.Container {
  sprite: Phaser.GameObjects.Sprite
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y)
    this.scene = scene
    this.scene.add.existing(this)
    const sprite = this.scene.add.sprite(0, 0, key).setOrigin(0)
    this.sprite = sprite
    this.add(sprite)
    this.setVisible(false)
  }
  centerPosition() {
    return {
      x: this.x + TILE_SIZE / 2,
      y: this.y + TILE_SIZE / 2,
    }
  }
}
