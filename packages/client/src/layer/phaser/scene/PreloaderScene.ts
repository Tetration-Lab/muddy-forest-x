import Phaser from 'phaser'
import { MAIN_SCENE, PRELOADER_SCENE } from '../constant/scene'
class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(PRELOADER_SCENE)
  }

  preload() {
    this.load.spritesheet('dogeSheet', 'assets/sprite/P4_48px_v2.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p1Sheet', 'assets/sprite/P1_24px_v4.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('p2Sheet', 'assets/sprite/P2_48px_v3.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p3Sheet', 'assets/sprite/P3_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p8Sheet', 'assets/sprite/P8.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('H1Sheet', 'assets/sprite/H1_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.image('explorerSheet', 'assets/sprite/explorer.jpg')
    this.load.image('tile', 'assets/tile.png')
  }

  create() {
    this.scene.start(MAIN_SCENE)
  }
}
export default PreloaderScene
