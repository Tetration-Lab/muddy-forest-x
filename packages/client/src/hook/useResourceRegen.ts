import { useEffect, useState } from 'react'
import { Components } from '../layer/network/components'
import { ComponentV } from '../types/entity'

export const useResourcesRegen = (
  resources: Map<string, ComponentV<Components['Resource']>>,
  enableRegen: boolean = true,
) => {
  const [value, setValue] = useState<{ [key in string]: number }>({})
  useEffect(() => {
    setValue(
      !resources || resources.size === 0
        ? {}
        : Object.fromEntries(
            [...resources.entries()].map(([k, v]) => [
              k,
              v?.value >= v?.cap
                ? v?.value
                : Math.min(v?.cap, v?.value + (enableRegen ? v?.rpb * (Math.floor(Date.now() / 1000) - v?.lrt) : 0)),
            ]),
          ),
    )
    if (!enableRegen) return () => {}
    const interval = setInterval(
      () =>
        setValue((e) =>
          Object.fromEntries(
            [...resources.entries()].map(([k, v]) => [k, e[k] >= v?.cap ? e[k] : Math.min(v?.cap, e[k] + v?.rpb)]),
          ),
        ),
      1000,
    )
    return () => clearInterval(interval)
  }, [resources, enableRegen])

  return value
}

export const useResourceRegen = (resource: ComponentV<Components['Resource']>, enableRegen: boolean = true) => {
  const [value, setValue] = useState(0)
  useEffect(() => {
    setValue(
      !resource
        ? 0
        : resource?.value >= resource?.cap
        ? resource?.value
        : Math.min(
            resource?.cap,
            resource?.value + (enableRegen ? resource?.rpb * (Math.floor(Date.now() / 1000) - resource?.lrt) : 0),
          ),
    )
    if (!enableRegen) return () => {}
    const interval = setInterval(
      () => setValue((e) => (e >= resource?.cap ? e : Math.min(resource?.cap, e + resource?.rpb))),
      1000,
    )
    return () => clearInterval(interval)
  }, [resource, enableRegen])

  return value
}
