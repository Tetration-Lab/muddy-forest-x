import Phaser from 'phaser'
import { AUDIO, IMAGE, SPRITE } from '../constant/resource'
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
    this.load.image(IMAGE.APE_ALIEN_SIGN, 'assets/images/ape_alien_sign.png')
    this.load.image(IMAGE.APE_AI_SIGN, 'assets/images/ai_ape_sign.png')

    this.load.image(IMAGE.APE_APE_AURA, 'assets/images/ape_ape_aura.png')
    this.load.image(IMAGE.APE_ALIEN_AURA, 'assets/images/alien_ape_aura.png')
    this.load.image(IMAGE.APE_AI_AURA, 'assets/images/ai_ape_aura.png')

    this.load.spritesheet(SPRITE.APE_ALINE_CAPITAL, 'assets/sprite/H1_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_APE_CAPITAL, 'assets/sprite/H2_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.APE_AI_CAPITAL, 'assets/sprite/H3_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.Capital_4, 'assets/sprite/H4_320px.png', { frameWidth: 320, frameHeight: 320 })
    this.load.spritesheet(SPRITE.TELEPORT, 'assets/sprite/teleportsheet.png', { frameWidth: 280, frameHeight: 280 })
    this.load.spritesheet(SPRITE.BOMB, 'assets/sprite/bomb_sheet.png', { frameWidth: 256, frameHeight: 256 })
    this.load.spritesheet(SPRITE.AI_SHIP, 'assets/sprite/AI_Ship-Sheet.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet(SPRITE.ALIEN_SHIP, 'assets/sprite/Alien_Ship-Sheet.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet(SPRITE.APE_SHIP, 'assets/sprite/Ape_Ship-Sheet.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet(SPRITE.LASER, 'assets/sprite/laser_96x32.png', { frameWidth: 32, frameHeight: 32 })

    this.load.audio(AUDIO.PEW, 'assets/audio/pewpew.mp3')
    this.load.audio(AUDIO.PEW_2, 'assets/audio/pewpew2.mp3')
    this.load.audio(AUDIO.PEW_3, 'assets/audio/pewpew3.mp3')
    this.load.audio(AUDIO.PEW_4, 'assets/audio/pewpew4.mp3')

    this.load.audio(AUDIO.HUH_1, 'assets/audio/huh_1.mp3')
    this.load.audio(AUDIO.HUH_2, 'assets/audio/huh_2.mp3')
    this.load.audio(AUDIO.HUH_3, 'assets/audio/huh_3.mp3')

    this.load.audio(AUDIO.OH, 'assets/audio/oh.mp3')
    this.load.audio(AUDIO.OH_2, 'assets/audio/oh_2.mp3')
    this.load.audio(AUDIO.OH_3, 'assets/audio/oh_3.mp3')
    this.load.audio(AUDIO.BGM, 'assets/audio/Space-ambience.mp3')
    this.load.audio(AUDIO.WARP, 'assets/audio/Spaceship_warp.mp3')
  }

  create() {
    this.scene.start(MAIN_SCENE)
  }
}
export default PreloaderScene
