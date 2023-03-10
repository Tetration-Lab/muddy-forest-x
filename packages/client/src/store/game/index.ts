import { createStore } from 'zustand/vanilla'
import { HQShip } from '../../layer/phaser/gameobject/HQShip'
import { Planet } from '../../layer/phaser/gameobject/Planet'

export type Store = {
  teleportModals: Map<string, Phaser.Math.Vector2>
  planetModals: Map<string, Phaser.Math.Vector2>
  planets: Map<string, Planet>
  spaceships: Map<string, HQShip>
}

const initialState = {
  teleportModals: new Map<string, Phaser.Math.Vector2>(),
  planetModals: new Map<string, Phaser.Math.Vector2>(),
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

export const closePlanetModal = (id: string) => {
  gameStore.setState((state) => {
    const planetModals = new Map(state.planetModals)
    planetModals.delete(id)
    return { planetModals }
  })
}

export const openPlanetModal = (id: string, position: Phaser.Math.Vector2) => {
  gameStore.setState((state) => {
    const planetModals = new Map(state.planetModals)
    planetModals.set(id, position)
    return { planetModals }
  })
}

export const openTeleportModal = (id: string, position: Phaser.Math.Vector2) => {
  gameStore.setState((state) => {
    const teleportModals = new Map(state.teleportModals)
    teleportModals.set(id, position)
    return { teleportModals }
  })
}

export const closeTeleportModal = (id: string) => {
  gameStore.setState((state) => {
    const teleportModals = new Map(state.teleportModals)
    teleportModals.delete(id)
    return { teleportModals }
  })
}
