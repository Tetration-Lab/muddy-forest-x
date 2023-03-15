import Phaser from 'phaser'
import { IMAGE, SPRITE } from '../constant/resource'
import { MAIN_SCENE, PRELOADER_SCENE } from '../constant/scene'
class PreloaderScene extends Phaser.Scene {
  constructor() {
    super(PRELOADER_SCENE)
  }

  preload() {
    this.load.image(IMAGE.AI_SHIP, 'assets/sprite/ai_ship.png')
    this.load.image(IMAGE.ALIEN_SHIP, 'assets/sprite/alien_ship.png')
    this.load.image(IMAGE.APE_SHIP, 'assets/sprite/apeape_ship.png')

    this.load.spritesheet(SPRITE.DOGE, 'assets/sprite/P4_48px_v2.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P1_1, 'assets/sprite/P1_24px.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet(SPRITE.P1_2, 'assets/sprite/P1_24px_v3.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet(SPRITE.P1_3, 'assets/sprite/P1_24px_v4.png', { frameWidth: 24, frameHeight: 24 })
    this.load.spritesheet(SPRITE.P2_1, 'assets/sprite/P2_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P2_2, 'assets/sprite/P2_48px_v2.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P2_3, 'assets/sprite/P2_48px_v3.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P3, 'assets/sprite/P3_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P5, 'assets/sprite/P5_48px.png', { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet(SPRITE.P7_1, 'assets/sprite/P7_64.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet(SPRITE.P7_2, 'assets/sprite/P7.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet(SPRITE.P8_1, 'assets/sprite/P8_128px_v2.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet(SPRITE.P8_2, 'assets/sprite/P8.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet(SPRITE.EXPLORER, 'assets/sprite/Scouting.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    // this.load.image('explorerSheet', 'assets/sprite/explorer.jpg')
    this.load.image(SPRITE.TILE, 'assets/tile.png')
    this.load.image(IMAGE.SELECTED_CURSOR, 'assets/images/selected-sheet.png')
    this.load.image(IMAGE.PLAYER_INDICATOR, 'assets/images/player-indicator.png')

    this.load.image(IMAGE.APE_APE_SIGN, 'assets/images/ape_ape_sign.png')
    this.load.image(IMAGE.APE_ALIEN_SIGN, 'assets/images/alien_ape_sign.png')
    this.load.image(IMAGE.APE_AI_SIGN, 'assets/images/ai_ape_sign.png')

    this.load.spritesheet(SPRITE.APE_ALINE_CAPITAL, 'assets/sprite/H1_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_APE_CAPITAL, 'assets/sprite/H2_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_AI_CAPITAL, 'assets/sprite/H3_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.Capital_4, 'assets/sprite/H4_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.TELEPORT, 'assets/sprite/teleportsheet.png', { frameWidth: 280, frameHeight: 280 })
    this.load.spritesheet(SPRITE.BOMB, 'assets/sprite/bomb_sheet.png', { frameWidth: 256, frameHeight: 256 })
  }

  create() {
    this.scene.start(MAIN_SCENE)
  }
}
export default PreloaderScene
