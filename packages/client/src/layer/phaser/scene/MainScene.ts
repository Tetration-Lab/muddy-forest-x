import Phaser from 'phaser'
import { GAME_HEIGHT, GAME_WIDTH, ZOOM_MULTIPLIER } from '../config/game'
import { GAME_SCENE, GAME_UI_SCENE, MAIN_SCENE } from '../constant/scene'

const debug = false
class MainScene extends Phaser.Scene {
  bg!: Phaser.GameObjects.TileSprite
  logo!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  parent!: Phaser.Structs.Size
  sizer!: Phaser.Structs.Size
  subScenes: Phaser.Scene[] = []
  responsiveSubScenes: Phaser.Scene[] = []
  constructor() {
    super(MAIN_SCENE)
  }

  create() {
    const width = this.scale.gameSize.width
    const height = this.scale.gameSize.height

    this.parent = new Phaser.Structs.Size(width, height)
    this.sizer = new Phaser.Structs.Size(GAME_WIDTH, GAME_HEIGHT, Phaser.Structs.Size.FIT, this.parent)

    this.parent.setSize(width, height)
    this.sizer.setSize(width, height)
    const rect = this.add.rectangle(this.getCenter().x, this.getCenter().y, GAME_WIDTH, GAME_HEIGHT, 0xff0000)
    rect.setOrigin(0.5)
    rect.setVisible(false)
    const graphics = this.add.graphics()
    graphics.lineStyle(16, 0x00ff00, 1)
    graphics.strokeRectShape(rect.getBounds())
    graphics.setVisible(debug)

    this.events.on(Phaser.GameObjects.Events.DESTROY, this.onDestroy)
    this.scale.on(Phaser.Scale.Events.RESIZE, this.resize, this)

    this.scene.launch(GAME_SCENE)
    this.scene.launch(GAME_UI_SCENE)
    const gameScreen = this.scene.get(GAME_SCENE)
    const gameUIScreen = this.scene.get(GAME_UI_SCENE)
    this.registerScenes(gameScreen)
    this.registerResponsiveSubScenes(gameUIScreen)
    this.updateCamera()
    this.scene.bringToTop()
  }

  registerResponsiveSubScenes(...scene: Phaser.Scene[]) {
    this.responsiveSubScenes.push(...scene)
  }

  registerScenes(...scene: Phaser.Scene[]) {
    this.subScenes.push(...scene)
  }

  onDestroy = () => {
    this.scale.off(Phaser.Scale.Events.RESIZE).removeAllListeners()
  }

  getCenter() {
    return new Phaser.Math.Vector2(GAME_WIDTH / 2, GAME_HEIGHT / 2)
  }

  resize(gameSize: Phaser.Structs.Size) {
    const width = gameSize.width
    const height = gameSize.height

    this.parent.setSize(width, height)
    this.sizer.setSize(width, height)

    this.updateCamera()
  }

  updateCamera() {
    const camera = this.cameras.main

    const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5)
    const y = Math.ceil((this.parent.height - this.sizer.height) * 0.5)
    const scaleX = this.sizer.width / GAME_WIDTH
    const scaleY = this.sizer.height / GAME_HEIGHT

    camera.setViewport(x, y, this.sizer.width, this.sizer.height)
    camera.setZoom(Math.max(scaleX, scaleY))
    camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)

    this.updateCameraInSubScenes()
  }

  updateStrickRatioCamera(camera: Phaser.Cameras.Scene2D.Camera) {
    const x = Math.ceil((this.parent.width - this.sizer.width) * 0.5)
    const y = Math.ceil((this.parent.height - this.sizer.height) * 0.5)
    const scaleX = this.sizer.width / GAME_WIDTH
    const scaleY = this.sizer.height / GAME_HEIGHT

    camera.setViewport(x, y, this.sizer.width, this.sizer.height)
    camera.setZoom(Math.max(scaleX, scaleY))
    camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)
    this.updateCameraInSubScenesFixRatio()
  }

  updateCameraInSubScenesFixRatio() {
    for (const scene of this.responsiveSubScenes) {
      const camera = scene.cameras.main
      const zoom = this.getZoom()
      camera.setZoom(zoom)
      camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)
    }
  }

  updateCameraInSubScenes() {
    for (const scene of this.subScenes) {
      const camera = scene.cameras.main
      camera.centerOn(GAME_WIDTH / 2, GAME_HEIGHT / 2)
      const scaleX = scene.scale.width / GAME_WIDTH
      const scaleY = scene.scale.height / GAME_HEIGHT
      camera.setZoom(Math.max(scaleX, scaleY) * ZOOM_MULTIPLIER)
    }
  }

  getZoom() {
    return this.cameras.main.zoom
  }
}
export default MainScene
