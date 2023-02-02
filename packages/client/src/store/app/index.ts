import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'
import { PhaserLayer } from '../../layer/phaser/types'

export type Store = {
  networkLayer: NetworkLayer | null
  phaserLayer: PhaserLayer | null
  isFocusUI: boolean
  setNetworkLayer: (networkLayer: NetworkLayer) => void
  setPhaserLayer: (phaserLayer: PhaserLayer) => void
  setFocusUI: (isFocusUI: boolean) => void
}
const initialState = {
  networkLayer: null,
  phaserLayer: null,
  isFocusUI: false,
}

export const appStore = createStore<Store>((set) => ({
  ...initialState,
  setNetworkLayer: (networkLayer: NetworkLayer) => {
    set({ networkLayer })
  },
  setPhaserLayer: (phaserLayer: PhaserLayer) => {
    set({ phaserLayer })
  },
  setFocusUI: (isFocusUI: boolean) => {
    set({ isFocusUI })
  },
}))
