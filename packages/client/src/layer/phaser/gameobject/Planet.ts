export class Planet extends Phaser.GameObjects.Sprite {
  rect: Phaser.GameObjects.Rectangle
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture)
    this.rect = this.scene.add.rectangle(this.x, this.y, this.displayWidth, this.displayHeight, 0x0000ff)
    this.rect.setVisible(false)
    this.scene.add.existing(this)
    this.setInteractive()
  }

  registerOnClick(callback: () => void): this {
    this.on('pointerup', callback)
    return this
  }

  onDestory() {
    this.off('pointerup')
    this.rect.destroy()
    this.destroy()
  }

  setPositionWithDebug(x: number, y: number, color = 0x0000ff): this {
    this.setPosition(x, y)
    this.rect.setAlpha(0.5).setVisible(true)
    this.rect.fillColor = color
    this.rect.setPosition(x, y)
    return this
  }
}
