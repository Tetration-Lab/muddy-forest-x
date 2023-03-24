import { defineSystem, getComponentValue, Has, HasValue } from '@latticexyz/recs'
import { EntityType } from '../const/types'
import { NetworkLayer } from '../layer/network/types'
import { TILE_SIZE } from '../layer/phaser/config/chunk'
import { Planet } from '../layer/phaser/gameobject/Planet'
import { snapPosToGrid } from '../utils/snapToGrid'
import { hexToInt } from '../utils/utils'

export type CreateTeleportSystemCallback = (entityID: string, x: number, y: number) => void
export function createTeleportSystem(network: NetworkLayer, cb: CreateTeleportSystemCallback) {
  const {
    world,
    components: { Type, Position },
  } = network
  const query = [HasValue(Type, { value: EntityType.HQSHIP }), Has(Position)]
  defineSystem(world, query, (update) => {
    const position = getComponentValue(Position, update.entity)
    if (!position) return
    const entityID = network.world.entities[update.entity] as string
    const newPos = snapPosToGrid(
      {
        x: hexToInt(position.x) * TILE_SIZE,
        y: hexToInt(position.y) * TILE_SIZE,
      },
      TILE_SIZE,
    )
    cb(entityID, newPos.x, newPos.y)
  })
}
