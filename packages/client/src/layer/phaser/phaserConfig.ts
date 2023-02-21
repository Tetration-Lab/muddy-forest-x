import MainScene from './scene/MainScene'
import GameScene from './scene/GameScene'
import { GAME_HEIGHT, GAME_WIDTH } from './config/game'
import GameUIScene from './scene/GameUIScene'
import PreloaderScene from './scene/PreloaderScene'

const phaserConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'phaser-game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {},
  },
  // backgroundColor: '#202326',
  pixelArt: true,
  roundPixels: true,
  plugins: {},
  scene: [PreloaderScene, MainScene, GameScene, GameUIScene],
}
export default phaserConfig
