import { formatEntityID, SyncState } from '@latticexyz/network'
import { defineComponentSystem, defineSystem, getComponentValue, Has, HasValue, runQuery, Type } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { Planet } from '../layer/phaser/gameobject/Planet'
import GameScene from '../layer/phaser/scene/GameScene'
import { hexToInt } from '../utils/utils'

export function createAttackSystem(network: NetworkLayer, scene: GameScene) {
  const { world, systemCallStreams } = network
  const attack = systemCallStreams['system.Attack'].subscribe((data) => {
    const attacker = formatEntityID(data.args['args']['entity'].toHexString())
    const target = formatEntityID(data.args['args']['targetEntity'].toHexString())
    console.log(attacker, target)
    let attack = null
    let targetObj = null
    // find attacker
    const objCollections = [scene.ships, scene.planets]
    for (let i = 0; i < objCollections.length; i++) {
      attack = objCollections[i].get(attacker) || null
      if (attack) {
        break
      }
    }
    for (let i = 0; i < objCollections.length; i++) {
      targetObj = objCollections[i].get(target) || null
      if (targetObj) {
        break
      }
    }

    if (attack && targetObj) {
      attack.attackTo(new Phaser.Math.Vector2(targetObj.x, targetObj.y))
    }
  })
}
