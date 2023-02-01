import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { GAME_UI_SCENE } from '../constant/scene'
class GameUIScene extends Phaser.Scene {
  rectR!: Phaser.GameObjects.Rectangle
  chunkText!: Phaser.GameObjects.Text
  constructor() {
    super(GAME_UI_SCENE)
  }

  create() {
    const debug = true
    const rect = this.add.rectangle(0, 0, 100, 100, 0x00ff00, 0.5)
    rect.setOrigin(0).setVisible(debug)
    const { width } = this.scale.gameSize
    this.rectR = this.add.rectangle(width - 100, 0, 100, 100, 0x00ff00, 0.5)
    this.rectR.setOrigin(0).setVisible(debug)
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this)
    this.chunkText = this.add.text(0, 100, 'hello', { color: '#ffffff', align: 'right' })
    this.add.rectangle(width, 0, 100, 100, 0x00ff00, 0.5).setOrigin(0)
    this.resize(this.scale.gameSize)

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)
  }

  resize = (gameSize: Phaser.Structs.Size) => {
    const { width } = gameSize
    this.rectR.setPosition(width - this.rectR.displayWidth, this.rectR.y)
  }

  setChunkText(text: string) {
    this.chunkText.setText(text)
  }

  getCenter() {
    return new Phaser.Math.Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  }

  onDestroy = () => {
    /**
     * TODO: clean up for event listeners in this scene
     */
    this.scale.off(Phaser.Scale.Events.RESIZE, this.resize, this)
  }
}
export default GameUIScene
