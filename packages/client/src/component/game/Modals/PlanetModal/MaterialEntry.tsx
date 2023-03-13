import { Badge, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useMemo } from 'react'
import { MATERIALS } from '../../../../const/materials'
import { Components } from '../../../../layer/network/components'
import { ComponentV } from '../../../../types/entity'
import { GameItem } from '../../common/GameItem'

export interface MaterialEntryProps {
  id: string
  resource: ComponentV<Components['Resource']>
}

export const MaterialEntry = ({ id, resource }: MaterialEntryProps) => {
  const theme = useTheme()
  const material = useMemo(() => MATERIALS[id], [id])
  return (
    <Stack
      direction="row"
      spacing={1}
      p={0.5}
      sx={{
        borderRadius: '12px',
        backgroundColor: theme.palette.grayScale.darkGray,
      }}
    >
      <Badge
        badgeContent={`${resource.value}`}
        max={999999999}
        color="primary"
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: theme.palette.grayScale.black,
            bottom: 4,
            right: 4,
          },
        }}
      >
        <GameItem imageUrl={material.imageUrl} sx={{ cursor: undefined }} />
      </Badge>
      <Stack
        px={1}
        py={0.5}
        sx={{ backgroundColor: theme.palette.grayScale.almostBlack, flex: 1, borderRadius: '8px' }}
        justifyContent="center"
      >
        <Typography fontSize={14} color={theme.palette.grayScale.almostGray}>
          {material.name}
        </Typography>
        {resource.rpb > 0 && (
          <Typography fontSize={14} color={theme.palette.grayScale.almostDarkGray}>
            +{resource.rpb}/s
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
