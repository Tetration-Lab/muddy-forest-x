import MainScene from './scene/MainScene'
import GameScene from './scene/GameScene'
import { GAME_HEIGHT, GAME_WIDTH } from './config/game'
import GameUIScene from './scene/GameUIScene'

const phaserConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: 'phaser-game',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  physics: {
    default: 'arcade',
    arcade: {},
  },
  backgroundColor: '#000',
  pixelArt: true,
  roundPixels: true,
  plugins: {},
  scene: [MainScene, GameScene, GameUIScene],
}
export default phaserConfig
