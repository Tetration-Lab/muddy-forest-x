import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'
import { PhaserLayer } from '../../layer/phaser/types'

export type Store = {
  networkLayer: NetworkLayer | null
  phaserLayer: PhaserLayer | null
}
const initialState = {
  networkLayer: null,
  phaserLayer: null,
}

export const appStore = createStore<Store>(() => ({
  ...initialState,
}))
