import { SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'
import { hexToInt } from '../utils/utils'

export type CreateTeleportSystemCallback = (entityID: string, x: number, y: number) => void
export function createTeleportSystem(network: NetworkLayer, cb: CreateTeleportSystemCallback) {
  const {
    world,
    components: { Type, Position },
  } = network

  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position)]
  defineSystem(world, query, (update) => {
    console.log('createTeleportSystem:start')
    const position = getComponentValue(Position, update.entity)
    if (!position) return
    console.log('in game ==> Position system: ', position?.x, position?.y, 'eid', update.entity)
    const entityID = network.world.entities[update.entity] as string
    cb(entityID, hexToInt(position.x), hexToInt(position.y))
    console.log('createTeleportSystem:end')
  })
}
