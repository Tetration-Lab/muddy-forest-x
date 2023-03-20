import { HasValue } from '@latticexyz/recs'
import { useQuery } from '@latticexyz/std-client'
import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useStore } from 'zustand'
import { EntityType } from '../../../const/types'
import { useResourceRegen } from '../../../hook/useResourceRegen'
import { Components } from '../../../layer/network/components'
import { appStore } from '../../../store/app'
import { ComponentV } from '../../../types/entity'

export const PlanetStatBox = () => {
  const { components, network } = useStore(appStore, (state) => state.networkLayer)
  const value = useQuery([
    HasValue(components.Type, { value: EntityType.PLANET }),
    HasValue(components.Owner, { value: network.connectedAddress.get() }),
  ])
  return <StatBox title="Planets" value={`${value?.size}`} iconSrc="/assets/svg/planet-icon.svg" />
}

export const EnergyStatBox = (props: ComponentV<Components['Resource']>) => {
  const value = useResourceRegen(props)
  return <StatBox iconSrc="/assets/svg/item-energy-icon.svg" title="Energy" value={`${value}/${props.cap}`} />
}

export interface StatBoxProps {
  title: string
  value: string
  iconSrc: string
}

export const StatBox = ({ iconSrc, title, value }: StatBoxProps) => {
  const theme = useTheme()

  return (
    <Box
      p={0.5}
      sx={{
        backgroundColor: theme.palette.grayScale.black,
        fontFamily: 'VT323',
        borderRadius: '8px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Box component="img" src={iconSrc} sx={{ height: 18 }}></Box>
      <Stack>
        <Typography sx={{ fontFamily: 'VT323', fontSize: 12, lineHeight: 1 }}>{title}</Typography>
        <Typography sx={{ fontFamily: 'VT323', fontSize: 16, lineHeight: 1 }}>{value}</Typography>
      </Stack>
    </Box>
  )
}
