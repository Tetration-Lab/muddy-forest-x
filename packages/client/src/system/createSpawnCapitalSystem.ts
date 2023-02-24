import { SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'

export function createSpawnCapitalSystem(network: NetworkLayer, scene: Phaser.Scene) {
  const {
    world,
    components: { Type, Position },
  } = network

  const query = [HasValue(Type, { value: EntityType.CAPITAL })]
  console.log('createSpawnCapitalSystem:start')
  runQuery(query).forEach((entity) => {
    const position = getComponentValue(Position, entity)
    console.log('position', hexToInt(position.x), hexToInt(position.y), 'eid', entity)
    const p = new Planet(scene, hexToInt(position.x), hexToInt(position.y), 'H1Sheet')
    p.play('H1Idle')
  })
  console.log('createSpawnCapitalSystem:end')
  // defineSystem(world, query, (update) => {
  //   const position = getComponentValue(Position, update.entity)
  //   // if (!position) return
  //   // console.log('in game ==> Position system: ', position?.x, position?.y, 'eid', update.entity)
  // })
}

function hexToInt(hex: string) {
  // if start with negative sign
  if (hex[0] === '-') {
    return -parseInt(hex.slice(1), 16)
  }
  return parseInt(hex, 16)
}
