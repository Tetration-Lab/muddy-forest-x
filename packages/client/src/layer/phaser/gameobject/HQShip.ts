import { SPRITE } from '../constant/resource'

export class HQShip extends Phaser.GameObjects.Sprite {
  rect: Phaser.GameObjects.Rectangle
  entityID: string
  owner: string
  teleportEffect: Phaser.GameObjects.Sprite
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, entityID: string, owner: string) {
    super(scene, x, y, texture)
    this.rect = this.scene.add.rectangle(this.x, this.y, this.displayWidth, this.displayHeight, 0x0000ff)
    this.rect.setVisible(false)
    this.scene.add.existing(this)
    this.setInteractive()
    this.entityID = entityID
    this.owner = owner
    this.teleportEffect = this.scene.add.sprite(0, 0, SPRITE.TELEPORT).setDepth(1000)
  }

  registerOnClick(callback: (pointer?: Phaser.Input.Pointer) => void): this {
    this.on('pointerup', callback)
    return this
  }

  onDestory() {
    this.off('pointerup')
    this.rect.destroy()
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
      this.teleportEffect.setPosition(this.x, this.y)
      this.teleportEffect.setVisible(true)
      this.teleportEffect.play(SPRITE.TELEPORT).on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.teleportEffect.setVisible(false)
      })
    })
  }

  setPositionWithDebug(x: number, y: number, color = 0x0000ff): this {
    this.setPosition(x, y)
    this.rect.setAlpha(0.5).setVisible(true)
    this.rect.fillColor = color
    this.rect.setPosition(x, y)
    return this
  }
}
