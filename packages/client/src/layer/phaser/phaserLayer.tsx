import { usePhaserLayer } from '../../hook/usePhaserLayer'
import phaserConfig from './phaserConfig'
export const PhaserLayer = () => {
  const { parentRef } = usePhaserLayer(phaserConfig)
  return (
    <>
      <div id="phaser-game" className="" ref={parentRef}></div>
    </>
  )
}
