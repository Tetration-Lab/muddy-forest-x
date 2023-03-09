import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect, useState } from 'react'

export const EnergyStatBox = (props: { regen: number; value: number; cap: number; latestRegen: number }) => {
  const [value, setValue] = useState(
    Math.min(props.cap, props.value + props.regen * (Math.floor(Date.now() / 1000) - props.latestRegen)),
  )
  useEffect(() => {
    const interval = setInterval(
      () => setValue((e) => (e >= props.cap ? e : Math.min(props.cap, e + props.regen))),
      1000,
    )
    return () => clearInterval(interval)
  }, [])

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
