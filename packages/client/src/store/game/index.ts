import { createStore } from 'zustand/vanilla'

export interface SendResourceData {
  name: string
  imageSrc: string
}
export interface SendResourceModal {
  open: boolean
  data?: SendResourceData
}

export type Store = {
  sendResourceModal: SendResourceModal
  setSendResource: (sendResourceModal: SendResourceModal) => void
}

const initialState = {
  sendResourceModal: {
    open: false,
    data: {
      name: '',
      imageSrc: '',
    },
  },
}

export const gameStore = createStore<Store>((set) => ({
  ...initialState,
  setSendResource: (sendResourceModal: SendResourceModal) => {
    set({ sendResourceModal })
  },
}))
