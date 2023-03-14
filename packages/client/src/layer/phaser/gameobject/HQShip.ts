import { TILE_SIZE } from '../config/chunk'
import { IMAGE, SPRITE } from '../constant/resource'

export const COLOR_GREEN = 0x00ff00
export const COLOR_RED = 0xff0000

export class HQShip extends Phaser.GameObjects.Container {
  entityID: string
  owner: string
  teleportEffect!: Phaser.GameObjects.Sprite
  predictCursor!: Phaser.GameObjects.Image
  shipImg!: Phaser.GameObjects.Image
  graphics!: Phaser.GameObjects.Graphics
  playerIndicator!: Phaser.GameObjects.Image
  energy = 0
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityID: string, owner: string) {
    super(scene, x, y)
    this.scene.add.existing(this)
    this.shipImg = this.scene.add.image(0, 0, texture).setDepth(this.depth + 1)
    this.shipImg.setInteractive()
    this.add(this.shipImg)
    this.predictCursor = this.scene.add
      .image(this.x, this.y, texture)
      .setDepth(1000)
      .setAlpha(0.5)
      .setDepth(this.depth + 1)
    this.predictCursor.setInteractive()
    this.predictCursor.setVisible(false)
    this.entityID = entityID
    this.owner = owner
    this.teleportEffect = this.scene.add.sprite(0, 0, SPRITE.TELEPORT).setDepth(1000)
    this.playerIndicator = this.scene.add.image(0, 0 + -48, IMAGE.PLAYER_INDICATOR).setDepth(1000)
    this.playerIndicator.setDisplaySize(32, 32)
    this.add(this.playerIndicator)
    this.graphics = this.scene.add.graphics()
    this.playerIndicator.setVisible(false)
  }

  setEnergy(e: number) {
    this.energy = e
  }

  setPlayerIndicatorVisible(visible: boolean) {
    this.playerIndicator.setVisible(visible)
  }

  registerOnClickPredictCursor(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.predictCursor.on('pointerup', callback)
    return this
  }

  registerOnClick(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.shipImg.on('pointerup', callback)
    return this
  }

  predictMove(x: number, y: number) {
    this.predictCursor.setPosition(x * TILE_SIZE, y * TILE_SIZE)
  }

  onDestory() {
    this.shipImg.off('pointerup')
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
    this.teleportEffect.play(SPRITE.TELEPORT).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.teleportEffect.setVisible(false)
      this.setPosition(x, y)
      this.graphics.clear()
      this.predictCursor.setPosition(this.x, this.y)
      this.teleportEffect.setPosition(this.x, this.y)
      this.teleportEffect.setVisible(true)
      this.teleportEffect.play(SPRITE.TELEPORT).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.teleportEffect.setVisible(false)
      })
    })
  }

  getPosition() {
    return new Phaser.Math.Vector2(this.x, this.y)
  }

  drawPredictLine(color = COLOR_GREEN) {
    this.graphics.clear()
    this.graphics.lineStyle(4, color, 1)
    this.graphics.lineBetween(this.x, this.y, this.predictCursor.x, this.predictCursor.y)
  }

  drawLine(color = COLOR_GREEN, x, y) {
    this.graphics.clear()
    this.graphics.lineStyle(4, color, 1)
    this.graphics.lineBetween(this.x, this.y, x, y)
  }

  clearLine() {
    this.graphics.clear()
  }

  resetPredictMovePosition() {
    this.graphics.clear()
    this.predictCursor.setPosition(this.x, this.y)
  }

  get coordinate(): { x: number; y: number } {
    return { x: Math.floor(this.x / TILE_SIZE), y: Math.floor(this.y / TILE_SIZE) }
  }

  get predictMoveCoordinate(): { x: number; y: number } {
    console.log('predict move coordinate', this.predictCursor.x, this.predictCursor.y)
    return { x: Math.floor(this.predictCursor.x / TILE_SIZE), y: Math.floor(this.predictCursor.y / TILE_SIZE) }
  }

  setPositionWithDebug(x: number, y: number, color = 0x0000ff): this {
    this.setPosition(x, y)
    this.predictCursor.setAlpha(0.5).setVisible(true)
    this.predictCursor.setPosition(x, y)
    return this
  }
}
