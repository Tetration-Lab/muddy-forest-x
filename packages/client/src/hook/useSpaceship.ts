import { getComponentValue } from '@latticexyz/recs'
import { useEffect, useState } from 'react'
import { appStore } from '../store/app'
import { Spaceship } from '../store/data'
import { filter } from 'rxjs'
import { formatEntityID } from '@latticexyz/network'
import { getEnergyEntityId } from '../const/resources'
import { getMoveCooldownEntityId } from '../const/cooldown'

export const useSpaceship = (id: string) => {
  const { world, components } = appStore.getState().networkLayer
  const eid = formatEntityID(id)
  const ind = world.registerEntity({ id: eid })
  const energyIndex = world.registerEntity({ id: formatEntityID(getEnergyEntityId(eid)) })
  const cooldownIndex = world.registerEntity({ id: formatEntityID(getMoveCooldownEntityId(eid)) })

  const [ship, setShip] = useState<Spaceship>()

  useEffect(() => {
    const name = getComponentValue(components.Name, ind)?.value
    const energy = getComponentValue(components.Resource, energyIndex)
    const owner = getComponentValue(components.Owner, ind)?.value
    const cooldown = getComponentValue(components.Cooldown, cooldownIndex)?.value

    setShip({
      index: ind,
      name,
      energy: {
        value: Number(energy?.value),
        cap: Number(energy?.cap),
        rpb: Number(energy?.rpb),
        lrt: energy?.lrt ?? 0,
      },
      resources: [],
      owner,
      cooldown: Number(cooldown ?? 0),
    })
  }, [ind, energyIndex, cooldownIndex])

  useEffect(() => {
    const cooldown = components.Cooldown.update$
      .pipe(filter((update) => update.entity === cooldownIndex))
      .subscribe((u) => {
        console.log(u)
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

    return () => {
      cooldown.unsubscribe()
      energy.unsubscribe()
    }
  }, [cooldownIndex, energyIndex])

  useEffect(() => console.log(ship), [ship])

  return ship
}
