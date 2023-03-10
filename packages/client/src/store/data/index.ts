import { formatEntityID } from '@latticexyz/network'
import { createStore } from 'zustand/vanilla'

export type Store = {
  planetLocations: Map<string, [number, number]>
  ownedSpaceships: string[]
}

const initialState = {
  planetLocations: new Map<string, [number, number]>(),
  ownedSpaceships: [],
}

export const dataStore = createStore<Store>((set) => ({
  ...initialState,
}))

export const initPlanetPosition = (id: string, position: [number, number]) => {
  dataStore.setState((state) => {
    const eid = formatEntityID(id)
    const planetLocations = new Map(state.planetLocations)
    planetLocations.set(eid, position)
    return { planetLocations }
  })
}
