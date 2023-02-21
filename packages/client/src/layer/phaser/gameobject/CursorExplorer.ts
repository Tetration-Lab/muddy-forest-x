import { TILE_SIZE } from '../config/chunk'

export class CursorExplorer extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.scene.add.existing(this)
    this.setOrigin(0)
    this.setDisplaySize(TILE_SIZE, TILE_SIZE)
    this.setPosition(x, y)
    this.scene.add.rectangle(x, y, TILE_SIZE, TILE_SIZE, 0xff0000).setOrigin(0)
    this.setDepth(1000)
  }
}
