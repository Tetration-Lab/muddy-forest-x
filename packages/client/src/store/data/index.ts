import { formatEntityID } from '@latticexyz/network'
import { ComponentValue, EntityIndex } from '@latticexyz/recs'
import { createStore } from 'zustand/vanilla'
import { NetworkLayer } from '../../layer/network/types'

export interface BaseEntity {
  index: EntityIndex
  name?: string
  energy: ComponentValue<NetworkLayer['components']['Resource']['schema'], undefined>
  resources: ComponentValue<NetworkLayer['components']['Resource']['schema'], undefined>[]
  owner?: string
}

export interface Planet extends BaseEntity {
  level: number
}

export interface Spaceship extends BaseEntity {
  cooldown: number
}

export interface Player {
  index: EntityIndex
  faction: number
  name?: string
}

export type Store = {
  planetLocations: Map<string, [number, number]>
  ownedSpaceships: string[]
}

const initialState = {
  planets: new Map<string, Planet>(),
  spaceships: new Map<string, Spaceship>(),
  players: new Map<string, Player>(),
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
