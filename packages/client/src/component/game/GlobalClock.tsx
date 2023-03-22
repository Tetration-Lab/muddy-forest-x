import { useStream } from '@latticexyz/std-client'
import { Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useStore } from 'zustand'
import { appStore } from '../../store/app'
import dayjs from 'dayjs'

export const GlobalClock = () => {
  const theme = useTheme()
  const { network } = useStore(appStore, (state) => state.networkLayer)
  const block = useStream(network.blockNumber$)
  const time = useStream(network.clock.time$)

  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: 28,
          fontFamily: 'VT323',
          lineHeight: 1,
        }}
      >
        {dayjs(time).format('hh:mm:s A')}
      </Typography>
      <Typography
        sx={{
          fontSize: 18,
          fontFamily: 'VT323',
          lineHeight: 1,
        }}
      >
        {dayjs(time).format('ddd D MMM')}{' '}
        <span
          style={{
            fontSize: 14,
            color: theme.palette.grayScale.almostGray,
          }}
        >
          UTC+0
        </span>
      </Typography>
      <Typography sx={{ fontSize: 10 }}>Block {block}</Typography>
    </Stack>
  )
}
