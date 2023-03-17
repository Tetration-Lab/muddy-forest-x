import { formatEntityID } from '@latticexyz/network'
import { getComponentValue } from '@latticexyz/recs'
import { NetworkLayer } from '../layer/network/types'
import GameScene from '../layer/phaser/scene/GameScene'
import { gameStore } from '../store/game'

export function createOwnerChangeSystem(network: NetworkLayer, scene: GameScene) {
  const { world, components } = network
  const change = components.Owner.update$.subscribe((data) => {
    const id = world.entities[data.entity]
    const ownerIndex = world.registerEntity({ id: formatEntityID(data.value[0].value) })
    const faction = getComponentValue(components.Faction, ownerIndex)?.value

    // Handle faction change on planet
    const { planets } = gameStore.getState()
    planets.get(id)?.changeFaction(faction)
  })
}
