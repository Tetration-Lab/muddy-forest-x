import { usePhaserLayer } from '../../hook/usePhaserLayer'
import phaserConfig from './phaserConfig'
export const PhaserLayer = () => {
  const { parentRef } = usePhaserLayer(phaserConfig)
  return (
    <>
      <div
        id="phaser-game"
        className="bg-[url('assets/bg/Space-area.png')]"
        style={{
          backgroundSize: 'cover',
          background: 'url("assets/bg/Space-area.png")',
        }}
        ref={parentRef}
      ></div>
    </>
  )
}
