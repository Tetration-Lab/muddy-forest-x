import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useResourceRegen } from '../../../hook/useResourceRegen'
import { Components } from '../../../layer/network/components'
import { ComponentV } from '../../../types/entity'

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
