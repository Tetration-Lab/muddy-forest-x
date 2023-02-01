import Phaser from 'phaser'

export function createPhaserLayer(config: Phaser.Types.Core.GameConfig) {
  const game = new Phaser.Game(config)
  const context = {
    game,
  }
  return context
}
