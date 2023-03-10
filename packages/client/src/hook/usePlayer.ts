import { formatEntityID } from '@latticexyz/network'
import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from 'zustand'
import { appStore } from '../store/app'
import { Player } from '../types/entity'

export const usePlayer = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const { ind } = useMemo(() => {
    const eid = formatEntityID(id)
    const ind = world.registerEntity({ id: eid })
    return { ind }
  }, [id])

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
