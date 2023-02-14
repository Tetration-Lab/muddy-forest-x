import { Remote } from 'comlink'
import { createStore } from 'zustand/vanilla'

type HashWorker = Remote<typeof import('../../miner/hasher.worker')>
export type Store = {
  worker: HashWorker | null
  setWorker: (worker: HashWorker) => void
}
const initialState = {
  worker: null,
}

export const workerStore = createStore<Store>((set) => ({
  ...initialState,
  setWorker: (worker: HashWorker) => {
    set({ worker })
  },
}))
