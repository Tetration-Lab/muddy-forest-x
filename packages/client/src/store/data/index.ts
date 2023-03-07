import { formatEntityID } from '@latticexyz/network'
import { ComponentValue, EntityIndex, getComponentValue } from '@latticexyz/recs'
import { createStore } from 'zustand/vanilla'
import { getEnergyEntityId } from '../../const/resources'
import { NetworkLayer } from '../../layer/network/types'
import { appStore } from '../app'

export interface BaseEntity {
  index: EntityIndex
  name?: string
  energy: ComponentValue<NetworkLayer['components']['Resource']['schema'], undefined>
  resources: ComponentValue<NetworkLayer['components']['Resource']['schema'], undefined>[]
  owner?: string
}

export interface Planet extends BaseEntity {
  position: [number, number]
}

export interface Spaceship extends BaseEntity {}

export type Store = {
  planets: Map<string, Planet>
  spaceship: Map<string, Spaceship>
}

const initialState = {
  planets: new Map<string, Planet>(),
  spaceship: new Map<string, Spaceship>(),
}

export const dataStore = createStore<Store>((set) => ({
  ...initialState,
}))

export const initPlanet = (id: string, position: [number, number]) => {
  const { world, components } = appStore.getState().networkLayer
  const eid = formatEntityID(id)
  const ind = world.registerEntity({ id: eid })
  const name = getComponentValue(components.Name, ind)?.value
  const energyId = getEnergyEntityId(eid)
  const energyIndex = world.registerEntity({ id: energyId })
  const energy = getComponentValue(components.Resource, energyIndex)
  const owner = getComponentValue(components.Owner, ind)?.value

  if (!owner) {
  }

  dataStore.setState((state) => {
    const planets = new Map(state.planets)
    planets.set(eid, {
      index: ind,
      name,
      energy,
      resources: [],
      position,
      owner,
    })
    return { planets }
  })
}

export const initSpaceship = (id: string) => {
  const { world, components } = appStore.getState().networkLayer
  const eid = formatEntityID(id)
  const ind = world.registerEntity({ id: eid })
  const name = getComponentValue(components.Name, ind)?.value
  const energyId = getEnergyEntityId(eid)
  const energyIndex = world.registerEntity({ id: energyId })
  const energy = getComponentValue(components.Resource, energyIndex)
  const owner = getComponentValue(components.Owner, ind)?.value

  dataStore.setState((state) => {
    const spaceship = new Map(state.spaceship)
    spaceship.set(eid, {
      index: ind,
      name,
      energy,
      resources: [],
      owner,
    })
    return { spaceship }
  })
}
