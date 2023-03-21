import { formatEntityID } from '@latticexyz/network'
import { getComponentValue, Has, HasValue, runQuery } from '@latticexyz/recs'
import { useEffect } from 'react'
import { useMap } from 'react-hanger'
import { filter } from 'rxjs'
import { useStore } from 'zustand'
import { FACTION } from '../const/faction'
import { EntityType } from '../const/types'
import { appStore } from '../store/app'

export const useLeaderboard = () => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const playerPlanets = useMap<string, number>()
  const factionPlanets = useMap<number, number>(new Map(Object.keys(FACTION).map((e) => [+e, 0])))

  useEffect(() => {
    const players = runQuery([HasValue(components.Type, { value: EntityType.PLAYER })])

    players.forEach((player) => {
      const playerAddress = world.entities[player]
      const planets = runQuery([
        HasValue(components.Type, { value: EntityType.PLANET }),
        HasValue(components.Owner, { value: playerAddress }),
      ])
      playerPlanets.set(playerAddress, planets.size)
      const faction = getComponentValue(components.Faction, player)?.value
      factionPlanets.set(faction, factionPlanets.value.get(faction) + planets.size || planets.size)
    })

    const subscription = components.Owner.update$
      .pipe(filter((update) => getComponentValue(components.Type, update.entity)?.value === EntityType.PLANET))
      .subscribe((update) => {
        const newOwner = update.value[0]?.value
        const oldOwner = update.value[1]?.value
        playerPlanets.set(newOwner, playerPlanets.value.get(newOwner) + 1 || 1)
        const newOwnerIndex = world.registerEntity({ id: formatEntityID(newOwner) })
        const newOwnerfaction = getComponentValue(components.Faction, newOwnerIndex)?.value
        factionPlanets.set(newOwnerfaction, factionPlanets.value.get(newOwnerfaction) + 1 || 1)
        if (oldOwner) {
          playerPlanets.set(oldOwner, playerPlanets.value.get(oldOwner) - 1)
          const oldOwnerIndex = world.registerEntity({ id: formatEntityID(oldOwner) })
          const oldOwnerfaction = getComponentValue(components.Faction, oldOwnerIndex)?.value
          factionPlanets.set(oldOwnerfaction, factionPlanets.value.get(oldOwnerfaction) - 1)
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    players: playerPlanets.value,
    factions: factionPlanets.value,
  }
}
