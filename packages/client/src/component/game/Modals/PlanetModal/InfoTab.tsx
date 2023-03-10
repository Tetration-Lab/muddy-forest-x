import { Box, Stack, Typography, useTheme } from '@mui/material'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { FACTION } from '../../../../const/faction'
import { Components } from '../../../../layer/network/components'
import { ComponentV } from '../../../../types/entity'

export interface FactionInfoTabProps {
  faction?: number
  name: string
  isYou: boolean
}

export const FactionInfoTab = ({ faction, name, isYou }: FactionInfoTabProps) => {
  const theme = useTheme()
  const f = useMemo(() => FACTION[faction], [faction])

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        borderRadius: '4px',
        border: `1px solid ${f?.color ?? theme.palette.grayScale.white}`,
        px: 1,
        py: 0.5,
      }}
      alignItems="center"
      flex={1}
    >
      <Box component="img" src={f?.signSrc ?? '/assets/svg/faction-unknown.svg'} sx={{ width: 24, height: 24 }} />
      <Typography fontSize={12}>{`${(name ?? '-') + (isYou ? ' (You)' : '')}`}</Typography>
    </Stack>
  )
}

export interface StatInfoTabProps {
  iconSrc: string
  title: string
  value: number
}

export const StatInfoTab = ({ iconSrc, title, value }: StatInfoTabProps) => {
  const theme = useTheme()

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ backgroundColor: theme.palette.grayScale.soBlack, borderRadius: '4px' }}
      alignItems="center"
      justifyContent="center"
      py={1}
      px={2}
    >
      <Box component="img" src={iconSrc} sx={{ width: 24, height: 24 }} />
      <Typography flex={1} sx={{ fontSize: 14 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 20, lineHeight: 1, fontFamily: 'VT323' }}>{`${value}%`}</Typography>
    </Stack>
  )
}

export const EnergyInfoTab = (props: ComponentV<Components['Resource']>) => {
  const [value, setValue] = useState(
    Math.min(props.cap, props.value + props.rpb * (Math.floor(Date.now() / 1000) - props.lrt)),
  )
  useEffect(() => {
    const interval = setInterval(() => setValue((e) => Math.min(props.cap, e + props.rpb)), 1000)
    return () => clearInterval(interval)
  }, [props.rpb, props.cap])

  return (
    <InfoTab
      iconSrc="/assets/svg/item-energy-icon.svg"
      title={`${value}/${props.cap}`}
      description={`+${props.rpb} per sec`}
    />
  )
}

export interface InfoTabProps {
  iconSrc: string
  title: string
  description?: string
  suffix?: ReactNode
}

export const InfoTab = ({ iconSrc, title, description, suffix }: InfoTabProps) => {
  const theme = useTheme()

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
      alignItems="center"
      justifyContent="center"
      flex={1}
      p={0.5}
    >
      <Box component="img" src={iconSrc} sx={{ width: 24, height: 24 }} />
      <Stack>
        <Typography fontSize={12}>{title}</Typography>
        {description && (
          <Typography sx={{ fontSize: 10, color: theme.palette.grayScale.almostGray }}>{description}</Typography>
        )}
      </Stack>
      {suffix}
    </Stack>
  )
}
