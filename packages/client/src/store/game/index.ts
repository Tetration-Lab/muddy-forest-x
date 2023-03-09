import { createStore } from 'zustand/vanilla'
import { HQShip } from '../../layer/phaser/gameobject/HQShip'
import { Planet } from '../../layer/phaser/gameobject/Planet'

export type Store = {
  sendResourceModal: Map<string, Phaser.Math.Vector2>
  planets: Map<string, Planet>
  spaceships: Map<string, HQShip>
}

const initialState = {
  sendResourceModal: new Map<string, Phaser.Math.Vector2>(),
  planets: new Map<string, Planet>(),
  spaceships: new Map<string, HQShip>(),
}

export const gameStore = createStore<Store>((set) => ({
  ...initialState,
}))

export const addPlanet = (id: string, planet: Planet) => {
  gameStore.setState((state) => {
    const planets = new Map(state.planets)
    planets.set(id, planet)
    return { planets }
  })
}

export const addSpaceship = (id: string, spaceship: HQShip) => {
  gameStore.setState((state) => {
    const spaceships = new Map(state.spaceships)
    spaceships.set(id, spaceship)
    return { spaceships }
  })
}

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
