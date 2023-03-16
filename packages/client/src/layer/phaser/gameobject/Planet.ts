import { TILE_SIZE } from '../config/chunk'
import { COLOR_GREEN, COLOR_RED } from '../constant'

export class Planet extends Phaser.GameObjects.Sprite {
  rect: Phaser.GameObjects.Rectangle
  entityID: string
  predictCursor!: Phaser.GameObjects.Rectangle
  graphics!: Phaser.GameObjects.Graphics
  isOwner = false
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityID: string) {
    super(scene, x, y, texture)
    this.rect = this.scene.add.rectangle(this.x, this.y, this.displayWidth, this.displayHeight, 0x0000ff)
    this.entityID = entityID
    this.rect.setVisible(false)
    this.scene.add.existing(this)
    this.setInteractive()
    this.graphics = this.scene.add.graphics()
    this.predictCursor = this.scene.add.rectangle(this.x, this.y, 0, 0, 0x00ff00).setAlpha(0.5)
  }

  registerOnClick(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.on('pointerup', callback)
    return this
  }

  setOwner(isOwner: boolean) {
    this.isOwner = isOwner
  }

  drawPredictLine(color = COLOR_RED) {
    this.graphics.clear()
    this.graphics.lineStyle(4, color, 1)
    this.graphics.lineBetween(this.x, this.y, this.predictCursor.x, this.predictCursor.y)
  }

  drawLine(color = COLOR_RED, x, y) {
    this.graphics.clear()
    this.graphics.lineStyle(4, color, 1)
    this.graphics.lineBetween(this.x, this.y, x, y)
  }

  clearLine() {
    this.graphics.clear()
  }

  clearPredictCursor() {
    this.predictCursor.setPosition(this.x, this.y)
  }

  resetPredictMovePosition() {
    this.graphics.clear()
    this.predictCursor.setPosition(this.x, this.y)
  }

  predictMove(x: number, y: number) {
    this.predictCursor.setPosition(x * TILE_SIZE, y * TILE_SIZE)
  }

  onDestory() {
    this.off('pointerup')
    this.rect.destroy()
    this.destroy()
  }

  get coordinate(): { x: number; y: number } {
    return { x: Math.floor(this.x / TILE_SIZE), y: Math.floor(this.y / TILE_SIZE) }
  }

  setPositionWithDebug(x: number, y: number, color = 0x0000ff): this {
    this.setPosition(x, y)
    this.rect.setAlpha(0.5).setVisible(true)
    this.rect.fillColor = color
    this.rect.setPosition(x, y)
    return this
  }
}
