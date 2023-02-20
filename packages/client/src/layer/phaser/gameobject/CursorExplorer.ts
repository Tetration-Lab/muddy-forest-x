import { TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.scene.add.existing(this)
    this.setDisplaySize(TILE_SIZE, TILE_SIZE)
    this.setDepth(1000)
  }
}
