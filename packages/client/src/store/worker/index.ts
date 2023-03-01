import { Remote } from 'comlink'
import { createStore } from 'zustand/vanilla'

export type HashWorker = Remote<typeof import('../../miner/hasher.worker')>

export type Store = {
  createWorker: () => HashWorker | undefined
}

const initialState = {
  createWorker: undefined,
}

export const workerStore = createStore<Store>((set) => ({
  ...initialState,
}))
