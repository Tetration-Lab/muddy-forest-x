import { createStore } from 'zustand/vanilla'

export interface SendResourceData {
  name: string
  imageSrc: string
  mouseScreenX: number
  mouseScreenY: number
}

export type Store = {
  sendResourceModal: Map<string, Phaser.Math.Vector2>
}

const initialState = {
  sendResourceModal: new Map<string, Phaser.Math.Vector2>(),
}

export const gameStore = createStore<Store>((set) => ({
  ...initialState,
}))

export const closeSendResourceModal = (id: string) => {
  gameStore.setState((state) => {
    const sendResourceModal = new Map(state.sendResourceModal)
    sendResourceModal.delete(id)
    return { sendResourceModal }
  })
}

export const openSendResourceModal = (id: string, position: Phaser.Math.Vector2) => {
  gameStore.setState((state) => {
    const sendResourceModal = new Map(state.sendResourceModal)
    sendResourceModal.set(id, position)
    return { sendResourceModal }
  })
}
