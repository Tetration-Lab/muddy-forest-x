import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useMemo } from 'react'
import { FACTION } from '../../../../const/faction'
import { useLeaderboard } from '../../../../hook/useLeaderboard'
import { ToolButton } from '../../../ToolButton'

export const LeaderboardActionBox = () => {
  const theme = useTheme()
  const { factions } = useLeaderboard()
  const factionSorted = useMemo(() => [...factions.entries()].sort((a, b) => b[1] - a[1]), [factions])

  return (
    <Stack
      p={1}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '8px',
        width: 310,
      }}
      spacing={1}
    >
      <Stack direction="row" alignItems="center">
        <ToolButton iconSrc="./assets/svg/trophy-icon.svg" />
        <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24 }}>
          Leaderboard
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1}>
        {factionSorted.map(([faction, planets], i) => {
          return (
            <Stack
              key={faction}
              direction="row"
              spacing={1}
              p={0.5}
              sx={{
                borderRadius: '4px',
                justifyContent: 'space-between',
                backgroundColor:
                  i === 0
                    ? theme.palette.ranking.first
                    : i === 1
                    ? theme.palette.ranking.second
                    : i === 2
                    ? theme.palette.ranking.third
                    : null,
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Box component="img" src={FACTION[faction].signSrc} sx={{ height: 32 }} />
              <Stack direction="row" alignItems="center" justifyContent="center" flex={1}>
                <Box component="img" src="/assets/svg/planet-icon.svg" sx={{ height: 24 }} />
                <Typography variant="body2">{planets}</Typography>
              </Stack>
            </Stack>
          )
        })}
      </Stack>
    </Stack>
  )
}
