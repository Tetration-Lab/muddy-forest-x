import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH } from '../config/game'
import { GAME_UI_SCENE } from '../constant/scene'
class GameUIScene extends Phaser.Scene {
  constructor() {
    super(GAME_UI_SCENE)
  }

  create() {
    this.resize(this.scale.gameSize)

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resize = (gameSize: Phaser.Structs.Size) => {}

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
