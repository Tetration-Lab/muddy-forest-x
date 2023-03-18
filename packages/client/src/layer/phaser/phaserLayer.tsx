import { useStore } from 'zustand'
import { usePhaserLayer } from '../../hook/usePhaserLayer'
import { appStore } from '../../store/app'
import phaserConfig from './phaserConfig'
export const PhaserLayer = () => {
  const { parentRef } = usePhaserLayer(phaserConfig)
  const store = useStore(appStore, (state) => state)

  const onClickPhaserLayer = () => {
    appStore.setState({ isFocusUI: false })
    const chatInputDom = document.getElementById('chat-input')
    if (chatInputDom) {
      chatInputDom.blur()
    }
  }
  return (
    <>
      <div
        onClick={onClickPhaserLayer}
        id="phaser-game"
        className="bg-[url('assets/bg/Space-area.png')]"
        style={{
          backgroundSize: 'contain',
          background: 'url("assets/bg/Space-area.png")',
        }}
        ref={parentRef}
      ></div>
    </>
  )
}
