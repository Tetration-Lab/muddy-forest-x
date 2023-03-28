import { FACTION } from '../../../const/faction'
import { AudioManager } from '../AudioManager'
import { TILE_SIZE } from '../config/chunk'
import { COLOR_GREEN } from '../constant'
import { IMAGE, SPRITE } from '../constant/resource'

export class HQShip extends Phaser.GameObjects.Container {
  entityID: string
  owner: string
  teleportEffect!: Phaser.GameObjects.Sprite
  predictCursor!: Phaser.GameObjects.Image
  shipImg!: Phaser.GameObjects.Sprite
  graphics!: Phaser.GameObjects.Graphics
  playerIndicator!: Phaser.GameObjects.Image
  energy = 0
  nameText: Phaser.GameObjects.Text
  faction = -1
  signFactionImg: Phaser.GameObjects.Image
  laserSprite: Phaser.GameObjects.Sprite
  bombSprite: Phaser.GameObjects.Sprite
  isOwner = false
  audioManager: AudioManager | null = null
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    entityID: string,
    owner: string,
    faction: number,
  ) {
    super(scene, x, y)
    this.scene.add.existing(this)
    this.laserSprite = this.scene.add.sprite(x, y, SPRITE.LASER).setDepth(1000 + this.depth + 1)
    this.laserSprite.play(SPRITE.LASER)
    this.bombSprite = this.scene.add.sprite(x, y, SPRITE.BOMB).setDepth(this.laserSprite.depth + 1)
    this.bombSprite.play(SPRITE.BOMB)
    this.bombSprite.setVisible(false)
    this.laserSprite.setVisible(false)
    this.shipImg = this.scene.add.sprite(0, 0, texture).setDepth(this.depth + 1)
    this.shipImg.setInteractive()
    this.shipImg.play(texture)
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
    this.nameText = this.scene.add
      .text(0, 50, '')
      .setOrigin(0.5, 0.5)
      .setDepth(1000)
      .setFontSize(18)
      .setFontStyle('bold')
      .setStroke('#FFFFFF80', 3)
    this.teleportEffect = this.scene.add.sprite(0, 0, SPRITE.TELEPORT).setDepth(1000)
    this.playerIndicator = this.scene.add.image(0, 0 + -48, IMAGE.PLAYER_INDICATOR).setDepth(1000)
    this.playerIndicator.setDisplaySize(32, 32)

    this.add(this.playerIndicator)
    this.add(this.nameText)
    this.graphics = this.scene.add.graphics()
    this.playerIndicator.setVisible(false)
    this.nameText.setScale(2)
    this.nameText.setColor(FACTION[faction].color || '#000')
    this.signFactionImg = this.scene.add.image(0, 50, FACTION[faction].signImg).setDepth(1000)
    this.add(this.signFactionImg)
  }

  setAudioManager(audioManager: AudioManager) {
    this.audioManager = audioManager
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
      if (this.isOwner) {
        this.scene.cameras.main.shake(100, 0.05)
      }
      this.bombSprite.play(SPRITE.BOMB).once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.bombSprite.setVisible(false)
      })
    })
  }

  setEnergy(e: number) {
    this.energy = e
  }

  setPlayerName(name: string) {
    this.nameText.setText(name)
    this.signFactionImg.setPosition(this.nameText.x - (this.nameText.displayWidth * 2) / 3, this.nameText.y)
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
    if (this.audioManager) {
      this.audioManager.playWarp()
    }
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

  clearPredictCursor() {
    this.predictCursor.setPosition(this.x, this.y)
  }

  resetPredictMovePosition() {
    this.graphics.clear()
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
