import { getComponentValue, Has, HasValue, runQuery } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { hexToInt } from '../utils/utils'

export type Callback = (x: number, y: number, eid: number) => void
export function createSpawnHQSystem(network: NetworkLayer, callback: Callback) {
  const {
    components: { Type, Position, Faction },
  } = network

  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position)]
  console.log('createSpawnHQSystem:start')
  runQuery(query).forEach((entity) => {
    const position = getComponentValue(Position, entity)
    console.log('createSpawnHQSystem:position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    callback(hexToInt(position.x), hexToInt(position.y), entity)
  })
  console.log('createSpawnHQSystem:end')
}
