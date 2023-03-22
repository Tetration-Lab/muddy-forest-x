import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'
import GameScene from '../../layer/phaser/scene/GameScene'
import { PhaserLayer } from '../../layer/phaser/types'

export type Store = {
  networkLayer: NetworkLayer | null
  phaserLayer: PhaserLayer | null
  isFocusUI: boolean
  gameScene: GameScene | null
  isLoading: boolean
}

const initialState = {
  networkLayer: null,
  phaserLayer: null,
  isFocusUI: false,
  gameScene: null,
  isLoading: true,
}

export const appStore = createStore<Store>((set) => ({
  ...initialState,
}))
