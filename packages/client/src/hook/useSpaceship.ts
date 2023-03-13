import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useMemo, useState } from 'react'
import { appStore } from '../store/app'
import { filter } from 'rxjs'
import { formatEntityID } from '@latticexyz/network'
import { getEnergyEntityId } from '../const/resources'
import { getMoveCooldownEntityId } from '../const/cooldown'
import { useStore } from 'zustand'
import { Spaceship } from '../types/entity'

export const useSpaceship = (id: string) => {
  const { world, components } = useStore(appStore, (state) => state.networkLayer)
  const { ind, energyIndex, cooldownIndex } = useMemo(() => {
    const eid = formatEntityID(id)
    const ind = world.registerEntity({ id: eid })
    const energyIndex = world.registerEntity({ id: formatEntityID(getEnergyEntityId(eid)) })
    const cooldownIndex = world.registerEntity({ id: formatEntityID(getMoveCooldownEntityId(eid)) })
    return {
      ind,
      energyIndex,
      cooldownIndex,
    }
  }, [id])

  const [ship, setShip] = useState<Spaceship>()

  useEffect(() => {
    const name = getComponentValue(components.Name, ind)?.value
    const energy = getComponentValue(components.Resource, energyIndex)
    const owner = getComponentValue(components.Owner, ind)?.value
    const cooldown = getComponentValue(components.Cooldown, cooldownIndex)?.value
    const level = getComponentValue(components.Level, ind)?.level
    const attack = (getComponentValue(components.Attack, ind)?.value ?? 10000) / 100
    const defense = (getComponentValue(components.Defense, ind)?.value ?? 10000) / 100

    setShip({
      index: ind,
      name,
      energy: {
        value: Number(energy?.value),
        cap: Number(energy?.cap),
        rpb: Number(energy?.rpb),
        lrt: energy?.lrt ?? 0,
      },
      resources: new Map(),
      owner,
      level,
      cooldown: Number(cooldown ?? 0),
      attack,
      defense,
    })
  }, [ind, energyIndex, cooldownIndex])

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
        console.log(ship)
      })
    const energy = components.Resource.update$
      .pipe(filter((update) => update.entity === energyIndex))
      .subscribe((u) => {
        setShip((ship) => {
          return {
            ...ship,
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
      setShip((ship) => {
        return {
          ...ship,
          attack: Number(u.value[0].value) / 100,
        }
      })
    })
    const defense = components.Defense.update$.pipe(filter((update) => update.entity === ind)).subscribe((u) => {
      setShip((ship) => {
        return {
          ...ship,
          defense: Number(u.value[0].value) / 100,
        }
      })
    })

    return () => {
      cooldown.unsubscribe()
      energy.unsubscribe()
      attack.unsubscribe()
      defense.unsubscribe()
    }
  }, [cooldownIndex, energyIndex])

  return ship
}
