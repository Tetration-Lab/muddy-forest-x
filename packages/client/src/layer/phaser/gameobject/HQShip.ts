import { TILE_SIZE } from '../config/chunk'
import { IMAGE, SPRITE } from '../constant/resource'

export class HQShip extends Phaser.GameObjects.Sprite {
  entityID: string
  owner: string
  teleportEffect!: Phaser.GameObjects.Sprite
  predictCursor!: Phaser.GameObjects.Image
  graphics!: Phaser.GameObjects.Graphics
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityID: string, owner: string) {
    super(scene, x, y, texture)
    this.predictCursor = this.scene.add
      .image(this.x, this.y, texture)
      .setDepth(1000)
      .setAlpha(0.5)
      .setDepth(this.depth + 1)
    this.predictCursor.setVisible(false)
    this.scene.add.existing(this)
    this.setInteractive()
    this.entityID = entityID
    this.owner = owner
    this.teleportEffect = this.scene.add.sprite(0, 0, SPRITE.TELEPORT).setDepth(1000)
    this.graphics = this.scene.add.graphics()
  }

  registerOnClick(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.on('pointerup', callback)
    return this
  }

  predictMove(x: number, y: number) {
    this.predictCursor.setPosition(x * TILE_SIZE, y * TILE_SIZE)
  }

  onDestory() {
    this.off('pointerup')
    this.predictCursor.destroy()
    this.destroy()
  }

  playTeleport() {
    this.teleportEffect.setPosition(this.x, this.y)
    this.teleportEffect.setVisible(true)
    this.teleportEffect.play(SPRITE.TELEPORT)
  }

  stopPlayTeleport() {
    this.teleportEffect.setVisible(false)
    this.teleportEffect.stop()
  }

  teleport(x: number, y: number) {
    this.teleportEffect.setPosition(this.x, this.y)
    this.teleportEffect.setVisible(true)
    this.teleportEffect.play(SPRITE.TELEPORT).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.teleportEffect.setVisible(false)
      this.setPosition(x, y)
      this.graphics.clear()
      this.predictCursor.setPosition(this.x, this.y)
      this.teleportEffect.setPosition(this.x, this.y)
      this.teleportEffect.setVisible(true)
      this.teleportEffect.play(SPRITE.TELEPORT).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.teleportEffect.setVisible(false)
      })
    })
  }

  drawPredictLine() {
    this.graphics.clear()
    this.graphics.lineStyle(4, 0x00ff00, 1)
    this.graphics.lineBetween(this.x, this.y, this.predictCursor.x, this.predictCursor.y)
    console.log(this.x, this.y, this.predictCursor.x, this.predictCursor.y)
  }

  resetPredictMovePosition() {
    this.predictCursor.setPosition(this.x, this.y)
  }

  get coordinate(): { x: number; y: number } {
    return { x: Math.floor(this.x / TILE_SIZE), y: Math.floor(this.y / TILE_SIZE) }
  }

  get predictMoveCoordinate(): { x: number; y: number } {
    return { x: Math.floor(this.predictCursor.x / TILE_SIZE), y: Math.floor(this.predictCursor.y / TILE_SIZE) }
  }

  setPositionWithDebug(x: number, y: number, color = 0x0000ff): this {
    this.setPosition(x, y)
    this.predictCursor.setAlpha(0.5).setVisible(true)
    this.predictCursor.setPosition(x, y)
    return this
  }
}
