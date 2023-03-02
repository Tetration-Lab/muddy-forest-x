import { getComponentValue, Has, HasValue, runQuery } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { hexToInt } from '../utils/utils'

export type Callback = (x: number, y: number, eid: number, owner: string) => void
export function createSpawnHQShipSystem(network: NetworkLayer, callback: Callback) {
  const {
    components: { Type, Position, Owner, Faction },
  } = network

  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position), Has(Owner)]
  //TODO: need to query faction
  console.log('createSpawnHQShipSystem:start')
  runQuery(query).forEach((entity) => {
    const position = getComponentValue(Position, entity)
    const owner = getComponentValue(Owner, entity)
    const faction = getComponentValue(Faction, entity)
    console.log('createSpawnHQShipSystem:position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    console.log('createSpawnHQShipSystem:faction', faction)
    const ownerStr = owner.value as unknown as string
    callback(hexToInt(position.x), hexToInt(position.y), entity, ownerStr)
  })
  console.log('createSpawnHQShipSystem:end')
}
