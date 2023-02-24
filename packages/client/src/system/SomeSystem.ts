import { SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'
import { hexToInt } from '../utils/utils'

export function createSomeSystem(network: NetworkLayer, scene: Phaser.Scene) {
  const {
    world,
    components: { Type, Position },
  } = network

  const query = [HasValue(Type, { value: EntityType.CAPITAL })]
  defineSystem(world, query, (update) => {
    // const position = getComponentValue(Position, update.entity)
    // if (!position) return
    // console.log('in game ==> Position system: ', position?.x, position?.y, 'eid', update.entity)
  })
}
