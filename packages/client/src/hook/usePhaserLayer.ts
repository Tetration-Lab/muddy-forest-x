import { useEffect, useRef } from 'react'
import { createPhaserLayer } from '../layer/phaser/createPhaserLayer'

export const usePhaserLayer = (config: Phaser.Types.Core.GameConfig) => {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const newGame = () => {
    if (parentRef.current && !gameRef.current) {
      // first time
      const phaserLayer = createPhaserLayer(config)
      gameRef.current = phaserLayer.game
    } else {
      // remove and create new once hot reload create duplicate
      if (gameRef.current) {
        gameRef.current.destroy(true)
        const phaserLayer = createPhaserLayer(config)
        gameRef.current = phaserLayer.game
      }
    }
  }
  useEffect(() => {
    newGame()
  }, [parentRef.current])

  return {
    parentRef,
    gameRef,
  }
}
