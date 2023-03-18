import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useMemo, useState } from 'react'
import { appStore } from '../store/app'
import { filter } from 'rxjs'
import { formatEntityID } from '@latticexyz/network'
import { getMoveCooldownEntityId } from '../const/cooldown'
import { useStore } from 'zustand'
import { Spaceship } from '../types/entity'
import { useBaseEntity } from './useBaseEntity'

export const useSpaceship = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const { entity, containedResources, eid } = useBaseEntity(id)
  const cooldownIndex = useMemo(() => world.registerEntity({ id: formatEntityID(getMoveCooldownEntityId(eid)) }), [id])

  const [ship, setShip] = useState<Spaceship>()

  useEffect(() => {
    const cooldown = getComponentValue(components.Cooldown, cooldownIndex)?.value
    if (entity) {
      setShip({
        ...entity,
        cooldown: Number(cooldown ?? 0),
      })
    }
  }, [entity, cooldownIndex])

  useEffect(() => {
    const cooldown = components.Cooldown.update$
      .pipe(filter((update) => update.entity === cooldownIndex))
      .subscribe((u) => {
        setShip((ship) => {
          return {
            ...ship,
            cooldown: Number(u.value[0].value),
          }
        })
      })
    return () => {
      cooldown.unsubscribe()
    }
  }, [cooldownIndex])

  return { ship, containedResources }
}
