import { createStore } from 'zustand'
import { CursorExplorer } from '../../layer/phaser/gameobject/CursorExplorer'

export type MinerStore = {
  miner: CursorExplorer | undefined
}

const initialState = {
  miner: undefined,
}

export const minerStore = createStore<MinerStore>((set) => ({
  ...initialState,
}))
