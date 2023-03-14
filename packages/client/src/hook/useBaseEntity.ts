import { formatEntityID } from '@latticexyz/network'
import { getComponentEntities, getComponentValue, getEntityComponents } from '@latticexyz/recs'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from 'zustand'
import { planetLevel } from '../const/planet'
import {
  ADVANCED_CAP,
  ADVANCED_REGEN,
  ALL_ADVANCED_RESOURCE_ID,
  BASE_ENERGY_CAP,
  BASE_ENERGY_REGEN,
  getEnergyEntityId,
  getEnergyLevelMultiplier,
  getLevelResourceStorageMultiplier,
  getResourceEntityId,
  isContainResource,
} from '../const/resources'
import { appStore } from '../store/app'
import { filter } from 'rxjs'
import { BaseEntity } from '../types/entity'
import _ from 'lodash'
import { EntityType } from '../const/types'

export const useBaseEntity = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const { eid, ind, energyIndex, resourceIndexes, containedResources } = useMemo(() => {
    const eid = formatEntityID(id)
    const ind = world.registerEntity({ id: eid })
    const energyIndex = world.registerEntity({ id: formatEntityID(getEnergyEntityId(eid)) })
    const resourceIndexes = ALL_ADVANCED_RESOURCE_ID.map((id) => {
      const rid = getResourceEntityId(eid, id)
      return [rid, world.registerEntity({ id: rid })] as const
    })
    const containedResources = ALL_ADVANCED_RESOURCE_ID.filter((e) => isContainResource(eid, e))

    return {
      eid,
      ind,
      energyIndex,
      resourceIndexes,
      containedResources,
    }
  }, [id])

  const [entity, setEntity] = useState<BaseEntity>()
  const [uninitilizedResources, setUninitializedResources] = useState<string[]>([])

  useEffect(() => {
    setUninitializedResources(
      resourceIndexes
        .map((e, i) => {
          return [getComponentValue(components.Resource, e[1]) === undefined, i] as const
        })
        .filter((e) => e[0])
        .map((e) => ALL_ADVANCED_RESOURCE_ID[e[1]]),
    )
  }, [resourceIndexes])

  useEffect(() => {
    const name = getComponentValue(components.Name, ind)?.value
    const energy = getComponentValue(components.Resource, energyIndex)
    const owner = getComponentValue(components.Owner, ind)?.value
    const level = getComponentValue(components.Level, ind)?.level ?? planetLevel(eid)
    const attack = (getComponentValue(components.Attack, ind)?.value ?? 10000) / 100
    const defense = (getComponentValue(components.Defense, ind)?.value ?? 10000) / 100
    const type = getComponentValue(components.Type, ind)?.value
    const resources = resourceIndexes.map((e, i) => {
      const r = getComponentValue(components.Resource, e[1])
      return [
        ALL_ADVANCED_RESOURCE_ID[i],
        {
          value: 0,
          cap: Number(r?.cap ?? ADVANCED_CAP * getLevelResourceStorageMultiplier(level)) / 100,
          rpb:
            Number(
              r?.rpb ??
                ((!type || type === EntityType.PLANET) && containedResources.includes(ALL_ADVANCED_RESOURCE_ID[i])
                  ? ADVANCED_REGEN * getLevelResourceStorageMultiplier(level)
                  : 0),
            ) / 100,
          lrt: r?.lrt ?? 0,
        },
      ] as const
    })

    setEntity({
      index: ind,
      type,
      name,
      energy: {
        value: Number(energy?.value ?? (BASE_ENERGY_CAP * getEnergyLevelMultiplier(level)) / 100),
        cap: Number(energy?.cap ?? (BASE_ENERGY_CAP * getEnergyLevelMultiplier(level)) / 100),
        rpb: Number(energy?.rpb ?? (BASE_ENERGY_REGEN * getEnergyLevelMultiplier(level)) / 100),
        lrt: energy?.lrt ?? 0,
      },
      resources: new Map(resources),
      owner,
      level,
      attack,
      defense,
    })
  }, [eid, ind, energyIndex, resourceIndexes])

  useEffect(() => {
    const ids = resourceIndexes.map((e) => e[0])
    const indexes = resourceIndexes.map((e) => e[1])
    const resources = components.Resource.update$
      .pipe(filter((update) => indexes.includes(update.entity)))
      .subscribe((u) => {
        setEntity((e) => {
          const id = world.entities[u.entity]
          return {
            ...e,
            resources: new Map([
              ...e.resources,
              [
                ALL_ADVANCED_RESOURCE_ID[ids.indexOf(id)],
                {
                  value: Number(u.value[0].value),
                  cap: Number(u.value[0].cap),
                  rpb: Number(u.value[0].rpb),
                  lrt: u.value[0].lrt,
                },
              ],
            ]),
          }
        })
      })
    return () => resources.unsubscribe()
  }, [resourceIndexes])

  useEffect(() => {
    const energy = components.Resource.update$
      .pipe(filter((update) => update.entity === energyIndex))
      .subscribe((u) => {
        setEntity((e) => {
          return {
            ...e,
            energy: {
              value: Number(u.value[0].value),
              cap: Number(u.value[0].cap),
              rpb: Number(u.value[0].rpb),
              lrt: u.value[0].lrt,
            },
          }
        })
      })
    const attack = components.Attack.update$.pipe(filter((update) => update.entity === ind)).subscribe((u) => {
      setEntity((e) => {
        return {
          ...e,
          attack: Number(u.value[0].value) / 100,
        }
      })
    })
    const defense = components.Defense.update$.pipe(filter((update) => update.entity === ind)).subscribe((u) => {
      setEntity((e) => {
        return {
          ...e,
          defense: Number(u.value[0].value) / 100,
        }
      })
    })
    const owner = components.Owner.update$.pipe(filter((update) => update.entity === ind)).subscribe((u) => {
      setEntity((e) => {
        return {
          ...e,
          owner: u.value[0].value,
        }
      })
    })

    return () => {
      energy.unsubscribe()
      attack.unsubscribe()
      defense.unsubscribe()
      owner.unsubscribe()
    }
  }, [ind, energyIndex])

  return { entity, containedResources, eid, ind, uninitilizedResources }
}
