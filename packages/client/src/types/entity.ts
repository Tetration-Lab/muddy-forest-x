import { Component, ComponentValue, EntityID, EntityIndex } from '@latticexyz/recs'
import { Components } from '../layer/network/components'

export type ComponentV<T extends Component> = ComponentValue<T['schema'], undefined>

export enum BaseEntityType {
  Planet = 'Planet',
  Spaceship = 'Spaceship',
}

export interface BaseEntity {
  index: EntityIndex
  name?: string
  energy: ComponentV<Components['Resource']>
  resources: Map<string, ComponentV<Components['Resource']>>
  owner?: string
  level: number
  attack: number
  defense: number
}

export interface Planet extends BaseEntity {
  buildings: string[]
}

export interface Spaceship extends BaseEntity {
  cooldown: number
}

export interface Player {
  index: EntityIndex
  faction: number
  name?: string
}
