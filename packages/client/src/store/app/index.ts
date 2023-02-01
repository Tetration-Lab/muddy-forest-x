import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'
import { PhaserLayer } from '../../layer/phaser/types'

export type Store = {
  networkLayer: NetworkLayer | null
  phaserLayer: PhaserLayer | null
  setNetworkLayer: (networkLayer: NetworkLayer) => void
}
const initialState = {
  networkLayer: null,
  phaserLayer: null,
}

export const appStore = createStore<Store>((set) => ({
  ...initialState,
  setNetworkLayer: (networkLayer: NetworkLayer) => {
    set({ networkLayer })
  }
}))
