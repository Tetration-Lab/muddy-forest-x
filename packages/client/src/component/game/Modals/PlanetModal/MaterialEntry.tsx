import { Badge, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useMemo } from 'react'
import { MATERIALS } from '../../../../const/materials'
import { useResourceRegen } from '../../../../hook/useResourceRegen'
import { Components } from '../../../../layer/network/components'
import { ComponentV } from '../../../../types/entity'
import { GameItem } from '../../common/GameItem'
import { GenericTag, TypeTag } from '../../common/LabelTag'
import { GameItemEntry } from './GameItemEntry'

export interface MaterialEntryProps {
  id: string
  resource: ComponentV<Components['Resource']>
  disabled: boolean
}

export const MaterialEntry = ({ id, resource, disabled }: MaterialEntryProps) => {
  const theme = useTheme()
  const material = useMemo(() => MATERIALS[id], [id])
  const value = useResourceRegen(resource, !disabled)

  return (
    <GameItemEntry
      iconUrl={material.imageUrl}
      title={material.name}
      description={resource.rpb > 0 && `+${resource.rpb}/s`}
      value={`${value}`}
      suffix={
        disabled ? (
          <GenericTag value="Inactive" color={theme.palette.common.gold} textColor="black" />
        ) : (
          <GenericTag value="Active" color={theme.palette.common.green} />
        )
      }
    />
  )
}
