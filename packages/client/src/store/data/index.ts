import { formatEntityID } from '@latticexyz/network'
import { ComponentValue, EntityIndex, getComponentValue } from '@latticexyz/recs'
import { createStore } from 'zustand/vanilla'
import { getCooldownEntityId, getMoveCooldownEntityId } from '../../const/cooldown'
import { planetLevel } from '../../const/planet'
import { BASE_ENERGY_CAP, BASE_ENERGY_REGEN, getEnergyEntityId, getEnergyLevelMultiplier } from '../../const/resources'
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
  level: number
}

export interface Spaceship extends BaseEntity {
  cooldown: number
}

export type Store = {
  planets: Map<string, Planet>
  spaceships: Map<string, Spaceship>
}

const initialState = {
  planets: new Map<string, Planet>(),
  spaceships: new Map<string, Spaceship>(),
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
  const level = getComponentValue(components.Level, ind)?.level ?? planetLevel(eid)
  const multiplier = getEnergyLevelMultiplier(level)

  dataStore.setState((state) => {
    const planets = new Map(state.planets)
    planets.set(eid, {
      index: ind,
      name,
      energy: {
        value: Number(energy?.value ?? ((BASE_ENERGY_CAP / 2) * multiplier) / 100),
        cap: Number(energy?.cap ?? (BASE_ENERGY_CAP * multiplier) / 100),
        rpb: Number(energy?.rpb ?? (BASE_ENERGY_REGEN * multiplier) / 100),
        bases: energy?.bases,
        lrb: energy?.lrb,
      },
      resources: [],
      position,
      owner,
      level,
    })
    return { planets }
  })
}

export const initSpaceship = (id: string, isHQShip: boolean = false) => {
  const { world, components } = appStore.getState().networkLayer
  const eid = formatEntityID(id)
  const ind = world.registerEntity({ id: eid })
  const name = getComponentValue(components.Name, ind)?.value
  const energyId = getEnergyEntityId(eid)
  const energyIndex = world.registerEntity({ id: energyId })
  const energy = getComponentValue(components.Resource, energyIndex)
  const owner = getComponentValue(components.Owner, ind)?.value
  const cooldownId = getMoveCooldownEntityId(eid)
  const cooldownIndex = world.registerEntity({ id: cooldownId })
  const cooldown = getComponentValue(components.Cooldown, cooldownIndex)?.value

  dataStore.setState((state) => {
    const spaceships = new Map(state.spaceships)
    spaceships.set(eid, {
      index: ind,
      name,
      energy: {
        value: Number(energy?.value),
        cap: Number(energy?.cap),
        rpb: Number(energy?.rpb),
        bases: energy?.bases,
        lrb: energy?.lrb,
      },
      resources: [],
      owner,
      cooldown: Number(cooldown),
    })
    return { spaceships }
  })
}
