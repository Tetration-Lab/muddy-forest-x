import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useState } from 'react'
import { useStore } from 'zustand'
import { appStore } from '../store/app'
import { filter } from 'rxjs'
import { Planet } from '../types/entity'
import _ from 'lodash'
import { useBaseEntity } from './useBaseEntity'

export const usePlanet = (id: string) => {
  const { components, network } = useStore(appStore, (state) => state.networkLayer)
  const { entity, containedResources, ind, uninitilizedResources } = useBaseEntity(id)

  const [planet, setPlanet] = useState<Planet>()

  useEffect(() => {
    const buildings = getComponentValue(components.Building, ind)?.value ?? []

    if (entity) {
      setPlanet({
        ...entity,
        buildings,
      })
    }
  }, [entity, ind])

  useEffect(() => {
    const buildings = components.Building.update$.pipe(filter((update) => update.entity === ind)).subscribe((u) => {
      setPlanet((planet) => {
        return {
          ...planet,
          buildings: u.value[0].value,
        }
      })
    })

    return () => {
      buildings.unsubscribe()
    }
  }, [ind])

  return { planet, containedResources, uninitilizedResources }
}
