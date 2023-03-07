import Phaser from 'phaser'
import { IMAGE, SPRITE } from '../constant/resource'
import { MAIN_SCENE, PRELOADER_SCENE } from '../constant/scene'
class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(PRELOADER_SCENE)
  }

  preload() {
    this.load.image(IMAGE.AI_SHIP, 'assets/sprite/ai_ship.png')
    this.load.spritesheet('dogeSheet', 'assets/sprite/P4_48px_v2.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p1Sheet', 'assets/sprite/P1_24px_v4.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet('p2Sheet', 'assets/sprite/P2_48px_v3.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p3Sheet', 'assets/sprite/P3_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('p8Sheet', 'assets/sprite/P8.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('explorerSheet', 'assets/sprite/Scouting.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    // this.load.image('explorerSheet', 'assets/sprite/explorer.jpg')
    this.load.image('tile', 'assets/tile.png')
    this.load.image(IMAGE.SELECTED_CURSOR, 'assets/images/selected-sheet.png')

    this.load.spritesheet(SPRITE.APE_ALINE_CAPITAL, 'assets/sprite/H1_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_APE_CAPITAL, 'assets/sprite/H2_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_AI_CAPITAL, 'assets/sprite/H3_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.Capital_4, 'assets/sprite/H4_320px.png', { frameWidth: 320, frameHeight: 320 })
  }

  create() {
    this.scene.start(MAIN_SCENE)
  }
}
export default PreloaderScene
