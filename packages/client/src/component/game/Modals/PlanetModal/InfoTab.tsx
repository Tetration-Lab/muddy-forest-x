import { Box, Stack, Typography, useTheme } from '@mui/material'
import React, { ReactNode, useMemo } from 'react'
import { FACTION } from '../../../../const/faction'
import { useResourceRegen } from '../../../../hook/useResourceRegen'
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
  value: number | ReactNode
  tooltip?: ReactNode
}

export const StatInfoTab = ({ iconSrc, title, value, tooltip }: StatInfoTabProps) => {
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
      <Typography sx={{ fontSize: 14 }}>{title}</Typography>
      {tooltip}
      <Box flex={1} />
      <pre>
        <Typography sx={{ fontSize: 20, lineHeight: 0.8, fontFamily: 'VT323', textAlign: 'end' }}>
          {typeof value === 'number' ? `${value}%` : value}
        </Typography>
      </pre>
    </Stack>
  )
}

export const EnergyInfoTab = (props: ComponentV<Components['Resource']>) => {
  const value = useResourceRegen(props)
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
  title: React.ReactNode
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
      px={1}
      py={0.5}
    >
      <Box component="img" src={iconSrc} sx={{ width: 24, height: 24 }} />
      <Stack flex={1} alignItems="center">
        <Typography fontSize={12}>{title}</Typography>
        {description && (
          <Typography sx={{ fontSize: 10, color: theme.palette.grayScale.almostGray }}>{description}</Typography>
        )}
      </Stack>
      {suffix}
    </Stack>
  )
}
