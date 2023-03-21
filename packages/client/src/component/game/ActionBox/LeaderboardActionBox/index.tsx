import { Badge, Box, Stack, Typography, useTheme } from '@mui/material'
import _ from 'lodash'
import { useEffect, useMemo } from 'react'
import { FACTION } from '../../../../const/faction'
import { useLeaderboard } from '../../../../hook/useLeaderboard'
import { ToolButton } from '../../../ToolButton'

export const LeaderboardActionBox = () => {
  const theme = useTheme()
  const { factions } = useLeaderboard()

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
        {_.sortBy([...factions.entries()], (o) => o[1]).map(([faction, planets], i) => {
          return (
            <Stack
              key={faction}
              direction="row"
              spacing={1}
              p={0.5}
              sx={{
                borderRadius: '4px',
                justifyContent: 'space-between',
                backgroundColor: theme.palette.grayScale.black,
                alignItems: 'center',
                flex: 1,
              }}
            >
              <Badge
                badgeContent={
                  <Box
                    component="img"
                    src={
                      i === 0
                        ? '/assets/svg/medal/gold-medal-icon.svg'
                        : i === 1
                        ? '/assets/svg/medal/silver-medal-icon.svg'
                        : '/assets/svg/medal/bronze-medal-icon.svg'
                    }
                    sx={{
                      width: 28,
                      height: 28,
                    }}
                  />
                }
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                sx={{
                  '& .MuiBadge-badge': {
                    width: 28,
                    height: 28,
                    bottom: 12,
                  },
                }}
              >
                <Box component="img" src={FACTION[faction].signSrc} sx={{ height: 32 }} />
              </Badge>
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
