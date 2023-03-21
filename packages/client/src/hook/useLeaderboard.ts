import { formatEntityID } from '@latticexyz/network'
import { getComponentValue, HasValue, runQuery } from '@latticexyz/recs'
import { useEffect, useState } from 'react'
import { filter } from 'rxjs'
import { useStore } from 'zustand'
import { FACTION } from '../const/faction'
import { EntityType } from '../const/types'
import { appStore } from '../store/app'

export const useLeaderboard = () => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const playerPlanets = useState<Map<string, number>>(new Map())
  const factionPlanets = useState<Map<number, number>>(new Map(Object.keys(FACTION).map((e) => [+e, 0])))

  useEffect(() => {
    const players = runQuery([HasValue(components.Type, { value: EntityType.PLAYER })])

    players.forEach((player) => {
      const playerAddress = world.entities[player]
      const planets = runQuery([
        HasValue(components.Type, { value: EntityType.PLANET }),
        HasValue(components.Owner, { value: playerAddress }),
      ])
      if (planets.size === 0) return
      playerPlanets[1]((e) => e.set(playerAddress, planets.size))
      const faction = getComponentValue(components.Faction, player)?.value
      factionPlanets[1]((e) => {
        return e.set(faction, e.get(faction) + planets.size)
      })
    })

    const subscription = components.Owner.update$
      .pipe(filter((update) => getComponentValue(components.Type, update.entity)?.value === EntityType.PLANET))
      .subscribe((update) => {
        const newOwner = formatEntityID(update.value[0]?.value)
        playerPlanets[1]((e) => {
          return e.set(newOwner, (e.get(newOwner) ?? 0) + 1)
        })
        const newOwnerIndex = world.registerEntity({ id: newOwner })
        const newOwnerfaction = getComponentValue(components.Faction, newOwnerIndex)?.value
        factionPlanets[1]((e) => {
          return e.set(newOwnerfaction, e.get(newOwnerfaction) + 1)
        })

        if (update.value[1]?.value) {
          const oldOwner = formatEntityID(update.value[1]?.value)
          playerPlanets[1]((e) => {
            return e.set(oldOwner, e.get(oldOwner) - 1)
          })
          const oldOwnerIndex = world.registerEntity({ id: oldOwner })
          const oldOwnerfaction = getComponentValue(components.Faction, oldOwnerIndex)?.value
          factionPlanets[1]((e) => {
            return e.set(oldOwnerfaction, e.get(oldOwnerfaction) - 1)
          })
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    players: playerPlanets[0],
    factions: factionPlanets[0],
  }
}
