import { defineSystem, EntityIndex, getComponentValue, Has, HasValue } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { TILE_SIZE } from '../layer/phaser/config/chunk'
import { hexToInt } from '../utils/utils'

export type Callback = (x: number, y: number, entityIndex: EntityIndex, entityID: string, owner: string) => void
export function createSpawnHQShipSystem(network: NetworkLayer, callback: Callback) {
  const {
    world,
    components: { Type, Position, Owner, Faction },
  } = network

  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position), Has(Owner)]
  //TODO: need to query faction
  console.log('createSpawnHQShipSystem:start')
  // runQuery(query).forEach((entity) => {
  defineSystem(world, query, (update) => {
    const entity = update.entity
    const position = getComponentValue(Position, entity)
    const owner = getComponentValue(Owner, entity)
    const faction = getComponentValue(Faction, entity)
    const entityID = network.world.entities[entity] as string
    console.log('createSpawnHQShipSystem:position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    console.log('createSpawnHQShipSystem:faction', faction)
    callback(hexToInt(position.x) * TILE_SIZE, hexToInt(position.y) * TILE_SIZE, entity, entityID, owner.value)
  })
  console.log('createSpawnHQShipSystem:end')
}
