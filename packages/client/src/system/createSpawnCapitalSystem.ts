import { SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'
import { hexToInt } from '../utils/utils'

export type CreateSpawnCapitalSystemCallback = (x: number, y: number, eid: number) => void
export function createSpawnCapitalSystem(network: NetworkLayer, callback: CreateSpawnCapitalSystemCallback) {
  const {
    components: { Type, Position },
  } = network

  const query = [HasValue(Type, { value: EntityType.CAPITAL })]
  console.log('createSpawnCapitalSystem:start')
  runQuery(query).forEach((entity) => {
    const position = getComponentValue(Position, entity)
    console.log('position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    callback(hexToInt(position.x), hexToInt(position.y), entity)
  })
  console.log('createSpawnCapitalSystem:end')
}
