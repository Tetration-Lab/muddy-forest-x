import { formatEntityID, SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'
import { hexToInt } from '../utils/utils'

export function createAttackSystem(network: NetworkLayer, scene: Phaser.Scene) {
  const {
    world,
    components: { Type, Position },
    systemCallStreams,
  } = network
  const attack = systemCallStreams['system.Attack'].subscribe((data) => {
    const attacker = formatEntityID(data.args['args']['entity'].toHexString())
    const target = formatEntityID(data.args['args']['targetEntity'].toHexString())
    console.log(attacker, target)
  })
}
