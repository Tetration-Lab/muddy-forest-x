import { formatEntityID } from '@latticexyz/network'
import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from 'zustand'
import { planetLevel } from '../const/planet'
import { BASE_ENERGY_CAP, BASE_ENERGY_REGEN, getEnergyEntityId, getEnergyLevelMultiplier } from '../const/resources'
import { appStore } from '../store/app'
import { filter } from 'rxjs'
import { Planet } from '../types/entity'

export const usePlanet = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const { eid, ind, energyIndex } = useMemo(() => {
    const eid = formatEntityID(id)
    const ind = world.registerEntity({ id: eid })
    const energyIndex = world.registerEntity({ id: formatEntityID(getEnergyEntityId(eid)) })
    return {
      eid,
      ind,
      energyIndex,
    }
  }, [id])

  const [planet, setPlanet] = useState<Planet>()

  useEffect(() => {
    const name = getComponentValue(components.Name, ind)?.value
    const energy = getComponentValue(components.Resource, energyIndex)
    const owner = getComponentValue(components.Owner, ind)?.value
    const level = getComponentValue(components.Level, ind)?.level ?? planetLevel(eid)

    setPlanet({
      index: ind,
      name,
      energy: {
        value: Number(energy?.value ?? (BASE_ENERGY_CAP * getEnergyLevelMultiplier(level)) / 100),
        cap: Number(energy?.cap ?? (BASE_ENERGY_CAP * getEnergyLevelMultiplier(level)) / 100),
        rpb: Number(energy?.rpb ?? (BASE_ENERGY_REGEN * getEnergyLevelMultiplier(level)) / 100),
        lrt: energy?.lrt ?? 0,
      },
      resources: [],
      owner,
      level,
    })
  }, [eid, ind, energyIndex])

  useEffect(() => {
    const energy = components.Resource.update$
      .pipe(filter((update) => update.entity === energyIndex))
      .subscribe((u) => {
        setPlanet((planet) => {
          return {
            ...planet,
            energy: {
              value: Number(u.value[0].value),
              cap: Number(u.value[0].cap),
              rpb: Number(u.value[0].rpb),
              lrt: u.value[0].lrt,
            },
          }
        })
      })

    return () => {
      energy.unsubscribe()
    }
  }, [energyIndex])

  return planet
}
