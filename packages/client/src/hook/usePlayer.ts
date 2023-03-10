import { formatEntityID } from '@latticexyz/network'
import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { appStore } from '../store/app'
import { Player } from '../store/data'

export const usePlayer = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const eid = formatEntityID(id)
  const ind = world.registerEntity({ id: eid })

  const [player, setPlayer] = useState<Player>()

  useEffect(() => {
    const name = getComponentValue(components.Name, ind)?.value
    const faction = getComponentValue(components.Faction, ind)?.value

    setPlayer({
      index: ind,
      faction,
      name,
    })
  }, [ind])

  useEffect(() => {
    return () => {}
  }, [])

  return player
}
