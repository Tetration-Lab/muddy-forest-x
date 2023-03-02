import { getComponentValue, Has, HasValue, runQuery } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { TILE_SIZE } from '../layer/phaser/config/chunk'
import { hexToInt } from '../utils/utils'

export type CreateSpawnCapitalSystemCallback = (x: number, y: number, eid: number, fractionID: number) => void
export function createSpawnCapitalSystem(network: NetworkLayer, callback: CreateSpawnCapitalSystemCallback) {
  const {
    components: { Type, Position, Faction },
  } = network

  const query = [HasValue(Type, { value: EntityType.FACTION }), Has(Position), Has(Faction)]
  console.log('createSpawnCapitalSystem:start')
  runQuery(query).forEach((entity) => {
    const position = getComponentValue(Position, entity)
    const faction = getComponentValue(Faction, entity)
    console.log('position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    callback(hexToInt(position.x) * TILE_SIZE, hexToInt(position.y) * TILE_SIZE, entity, faction.value)
  })
  console.log('createSpawnCapitalSystem:end')
}
