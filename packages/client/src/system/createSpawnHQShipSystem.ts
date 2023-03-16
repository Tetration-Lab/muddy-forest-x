import { formatEntityID } from '@latticexyz/network'
import { defineSystem, EntityIndex, getComponentValue, Has, HasValue } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { TILE_SIZE } from '../layer/phaser/config/chunk'
import { hexToInt } from '../utils/utils'

export type Callback = (
  x: number,
  y: number,
  entityIndex: EntityIndex,
  entityID: string,
  owner: string,
  name: string,
  fractionID: number,
) => void
export function createSpawnHQShipSystem(network: NetworkLayer, callback: Callback) {
  const {
    world,
    components: { Type, Position, Owner, Faction, Name },
  } = network

  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position), Has(Owner)]
  //TODO: need to query faction
  // runQuery(query).forEach((entity) => {
  defineSystem(world, query, (update) => {
    const entity = update.entity
    const position = getComponentValue(Position, entity)
    const owner = getComponentValue(Owner, entity)
    const entityID = network.world.entities[entity]
    const eid = formatEntityID(entityID)
    const ownerId = formatEntityID(owner.value)
    const ownerIndex = world.registerEntity({ id: ownerId })
    const name = getComponentValue(Name, ownerIndex)?.value
    const faction = getComponentValue(Faction, ownerIndex)?.value
    callback(
      hexToInt(position.x) * TILE_SIZE,
      hexToInt(position.y) * TILE_SIZE,
      entity,
      entityID,
      owner.value,
      name,
      faction,
    )
  })
}
