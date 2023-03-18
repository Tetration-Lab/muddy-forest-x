import { FACTION } from '../../../const/faction'
import { TILE_SIZE } from '../config/chunk'
import { COLOR_RED } from '../constant'
import { SPRITE } from '../constant/resource'

export class Planet extends Phaser.GameObjects.Sprite {
  rect: Phaser.GameObjects.Rectangle
  entityID: string
  predictCursor!: Phaser.GameObjects.Rectangle
  graphics!: Phaser.GameObjects.Graphics
  laserSprite: Phaser.GameObjects.Rectangle
  bombSprite: Phaser.GameObjects.Sprite
  aura?: Phaser.GameObjects.Image
  faction: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    scale: number,
    entityID: string,
    faction?: number,
  ) {
    super(scene, x, y, texture)
    this.setScale(scale)
    this.setDepth(1000)
    this.rect = this.scene.add.rectangle(this.x, this.y, this.displayWidth, this.displayHeight, 0x0000ff)
    this.entityID = entityID
    this.rect.setVisible(false)
    this.scene.add.existing(this)
    this.setInteractive()
    this.graphics = this.scene.add.graphics()
    this.predictCursor = this.scene.add.rectangle(this.x, this.y, 0, 0, 0x00ff00).setAlpha(0.5)
    this.laserSprite = this.scene.add.rectangle(x, y, 48 + 16, 12, 0xff0000).setDepth(1000 + this.depth + 1)
    this.bombSprite = this.scene.add.sprite(x, y, SPRITE.BOMB).setDepth(this.laserSprite.depth + 1)
    this.bombSprite.play(SPRITE.BOMB)
    this.bombSprite.setVisible(false)
    this.laserSprite.setVisible(false)
    this.changeFaction(faction)
  }

  changeFaction(faction: number) {
    if (!faction || this.faction === faction) return
    this.faction = faction
    this.aura?.destroy()
    this.aura = this.scene.add
      .image(this.x, this.y, FACTION[faction].auraImg)
      .setDepth(this.depth - 1)
      .setAlpha(0.5)
      .setDisplaySize(this.displayWidth * 1.5, this.displayHeight * 1.5)
  }

  registerOnClick(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.on('pointerup', callback)
    return this
  }

  attackTo(targetPos: Phaser.Math.Vector2) {
    this.laserSprite.setVisible(true)
    this.laserSprite.setPosition(this.x, this.y)
    this.laserSprite.setRotation(Phaser.Math.Angle.Between(this.x, this.y, targetPos.x, targetPos.y))
    const tweenMove = this.scene.tweens.add({
      targets: [this.laserSprite],
      alpha: 1,
      x: {
        from: this.x,
        to: targetPos.x,
      },
      y: {
        from: this.y,
        to: targetPos.y,
      },
      // },
      ease: 'Linear', // 'Linear, 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 500,
      repeat: 0, // -1: infinity
      yoyo: false,
    })
    tweenMove.once(Phaser.Tweens.Events.TWEEN_COMPLETE, () => {
      this.laserSprite.setVisible(false)
      this.bombSprite.setPosition(targetPos.x, targetPos.y)
      this.bombSprite.setVisible(true)
      this.bombSprite.play(SPRITE.BOMB).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.bombSprite.setVisible(false)
      })
    })
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
