import { useEffect, useState } from 'react'
import { Components } from '../layer/network/components'
import { ComponentV } from '../types/entity'

export const useResourceRegen = (resource: ComponentV<Components['Resource']>, enableRegen: boolean = true) => {
  const [value, setValue] = useState(
    Math.min(
      resource.cap,
      resource.value + (enableRegen ? resource.rpb * (Math.floor(Date.now() / 1000) - resource.lrt) : 0),
    ),
  )
  useEffect(() => {
    if (!enableRegen) return () => {}
    const interval = setInterval(() => setValue((e) => Math.min(resource.cap, e + resource.rpb)), 1000)
    return () => clearInterval(interval)
  }, [resource.rpb, resource.cap, enableRegen])

  return value
}
