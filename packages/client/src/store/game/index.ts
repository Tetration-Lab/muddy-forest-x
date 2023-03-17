import { createStore } from 'zustand/vanilla'
import { HQShip } from '../../layer/phaser/gameobject/HQShip'
import { Planet } from '../../layer/phaser/gameobject/Planet'

export type Store = {
  teleportAction?: string
  planetModals: Map<string, Phaser.Math.Vector2>
  attackModals: Map<string, [string, Phaser.Math.Vector2]>
  sendModals: Map<string, [string, Phaser.Math.Vector2]>
  planets: Map<string, Planet>
  spaceships: Map<string, HQShip>
  focusLocation: (v: Phaser.Types.Math.Vector2Like) => void
}

const initialState: Store = {
  teleportAction: undefined,
  planetModals: new Map(),
  attackModals: new Map(),
  sendModals: new Map(),
  planets: new Map(),
  spaceships: new Map(),
  focusLocation: () => {},
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

export const openTeleport = (id: string) => {
  gameStore.setState((state) => {
    return { teleportAction: id }
  })
}

export const closeTeleport = () => {
  gameStore.setState((state) => {
    const ship = state.spaceships.get(state.teleportAction)
    ship?.stopPlayTeleport()
    ship?.resetPredictMovePosition()
    return { teleportAction: undefined }
  })
}

export const openAttackModal = (id: string, targetId: string, position: Phaser.Math.Vector2) => {
  gameStore.setState((state) => {
    const attackModals = new Map(state.attackModals)
    attackModals.set(id, [targetId, position])
    return { attackModals }
  })
}

export const closeAttackModal = (id: string) => {
  gameStore.setState((state) => {
    const attackModals = new Map(state.attackModals)
    attackModals.delete(id)
    return { attackModals }
  })
}

export const openSendModal = (id: string, targetId: string, position: Phaser.Math.Vector2) => {
  gameStore.setState((state) => {
    const sendModals = new Map(state.sendModals)
    sendModals.set(id, [targetId, position])
    return { sendModals }
  })
}

export const closeSendModal = (id: string) => {
  gameStore.setState((state) => {
    const sendModals = new Map(state.sendModals)
    sendModals.delete(id)
    return { sendModals }
  })
}
