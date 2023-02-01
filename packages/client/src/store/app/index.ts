import { useStore } from 'zustand/react'
import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'
import { PhaserLayer } from '../../layer/phaser/types'

export type Store = {
  networkLayer: NetworkLayer | null
  phaserLayer: PhaserLayer | null
}

export const appStore = createStore<Store>(() => ({
  networkLayer: null,
  phaserLayer: null,
}))

export const useAppStore = () => useStore(appStore)
