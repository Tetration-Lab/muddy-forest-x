import { useCallback, useEffect, useRef } from 'react'
import { createPhaserLayer } from '../layer/phaser/createPhaserLayer'
import { appStore } from '../store/app'

export const usePhaserLayer = (config: Phaser.Types.Core.GameConfig) => {
  const store = appStore
  const parentRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<Phaser.Game | null>(null)
  const newGame = useCallback(() => {
    if (parentRef.current && !gameRef.current) {
      // first time
      const phaserLayer = createPhaserLayer(config)
      gameRef.current = phaserLayer.game
      store.setState({ phaserLayer })
    } else {
      // remove and create new once hot reload create duplicate
      if (gameRef.current) {
        gameRef.current.destroy(true)
        const phaserLayer = createPhaserLayer(config)
        gameRef.current = phaserLayer.game
      }
    }
  }, [config])

  useEffect(() => {
    newGame()
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
      }
    }
  }, [newGame])

  return {
    parentRef,
    gameRef,
  }
}
