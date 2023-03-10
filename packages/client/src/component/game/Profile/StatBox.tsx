import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'
import { Components } from '../../../layer/network/components'
import { ComponentV } from '../../../types/entity'

export const EnergyStatBox = (props: ComponentV<Components['Resource']>) => {
  const [value, setValue] = useState(
    Math.min(props.cap, props.value + props.rpb * (Math.floor(Date.now() / 1000) - props.lrt)),
  )
  useEffect(() => {
    const interval = setInterval(() => setValue((e) => Math.min(props.cap, e + props.rpb)), 1000)
    return () => clearInterval(interval)
  }, [props.rpb, props.cap])

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
