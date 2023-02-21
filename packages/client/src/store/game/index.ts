import { createStore } from 'zustand/vanilla'

export interface SendResourceData {
  name: string
  imageSrc: string
  mouseScreenX: number
  mouseScreenY: number
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
      mouseScreenX: 0,
      mouseScreenY: 0,
    },
  },
}

export const gameStore = createStore<Store>((set) => ({
  ...initialState,
  setSendResource: (sendResourceModal: SendResourceModal) => {
    set({ sendResourceModal })
  },
}))
