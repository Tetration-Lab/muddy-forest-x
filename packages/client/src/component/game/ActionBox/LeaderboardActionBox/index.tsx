import { Stack, Typography, useTheme } from '@mui/material'
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
        {Object.keys(FACTION).map((e) => {
          return <Typography>{factions.get(+e) ?? 0}</Typography>
        })}
      </Stack>
    </Stack>
  )
}
