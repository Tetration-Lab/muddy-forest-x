import { formatEntityID } from '@latticexyz/network'
import { getComponentValue } from '@latticexyz/recs'
import { NetworkLayer } from '../layer/network/types'
import GameScene from '../layer/phaser/scene/GameScene'
import { gameStore } from '../store/game'

export function createAttackSystem(network: NetworkLayer, scene: GameScene) {
  const {
    world,
    systemCallStreams,
    components,
    network: { connectedAddress },
  } = network
  const attack = systemCallStreams['system.Attack'].subscribe((data) => {
    const attackerId = formatEntityID(data.args['args']['entity'].toHexString())
    const targetId = formatEntityID(data.args['args']['targetEntity'].toHexString())
    const { spaceships, planets } = gameStore.getState()

    const attacker = spaceships.get(attackerId) ?? planets.get(attackerId)
    const target = spaceships.get(targetId) ?? planets.get(targetId)

    if (attacker && target) {
      const attackerOwner = getComponentValue(components.Owner, world.registerEntity({ id: attackerId }))?.value
      if (attackerOwner === connectedAddress.get()) {
        scene.audioManager.playPew()
      }

      attacker.attackTo(new Phaser.Math.Vector2(target.x, target.y))
    }
  })
}
