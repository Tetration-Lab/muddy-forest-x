import { Box, Stack, styled, Tooltip, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'

export interface CooldownStatusBadgeProps {
  imgSrc: string
  finishTimestamp: number
  hover?: {
    title: string
    description: string
  }
}

export const CooldownStatusBadge = ({ finishTimestamp, imgSrc, hover }: CooldownStatusBadgeProps) => {
  const [left, setLeft] = useState(Math.max(0, finishTimestamp - Math.floor(Date.now() / 1000)))
  useEffect(() => {
    const interval = setInterval(() => setLeft((e) => e - 1), 1000)
    return () => clearInterval(interval)
  }, [finishTimestamp])

  if (left <= 0) return <></>
  return <StatusBadge imgSrc={imgSrc} status={`${left} s`} hover={hover} />
}

export interface StatusBadgeProps {
  imgSrc: string
  status: string
  hover?: {
    title: string
    description: string
  }
}

export const StatusBadge = ({ imgSrc, status, hover }: StatusBadgeProps) => {
  const theme = useTheme()
  return (
    <Tooltip
      title={
        hover ? (
          <Stack width={220}>
            <Typography fontSize={16}>{hover.title}</Typography>
            <Typography fontSize={14} color={theme.palette.grayScale.almostDarkGray}>
              {hover.description}
            </Typography>
          </Stack>
        ) : null
      }
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: '#171923',
            '& .MuiTooltip-arrow': {
              color: '#171923',
            },
          },
        },
      }}
      arrow
      placement="bottom-start"
    >
      <Stack spacing={-0.5} alignItems="center">
        <Box
          sx={{
            width: 46,
            height: 46,
            backgroundColor: theme.palette.grayScale.almostBlack,
            border: `2px solid ${theme.palette.grayScale.black}`,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box component="img" src={imgSrc} sx={{ height: 32, width: 32 }}></Box>
        </Box>
        <Typography sx={{ fontFamily: 'VT323', color: theme.palette.grayScale.white }}>{status}</Typography>
      </Stack>
    </Tooltip>
  )
}
