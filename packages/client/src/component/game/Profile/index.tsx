import { formatEntityID } from '@latticexyz/network'
import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useStore } from 'zustand'
import { FACTION } from '../../../const/faction'
import { usePlayer } from '../../../hook/usePlayer'
import { useSpaceship } from '../../../hook/useSpaceship'
import { appStore } from '../../../store/app'
import { dataStore } from '../../../store/data'
import { gameStore } from '../../../store/game'
import { EnergyStatBox, StatBox } from './StatBox'
import { CooldownStatusBadge } from './StatusBadge'

export const Profile = () => {
  const theme = useTheme()

  const { network } = useStore(appStore, (state) => state.networkLayer)
  const shipId = useStore(dataStore, (state) => state.ownedSpaceships[0])
  const ship = useSpaceship(shipId ?? '0x0')
  const player = usePlayer(formatEntityID(network.connectedAddress.get()))
  const { shipSprite, focusLocation } = useStore(gameStore, (state) => ({
    shipSprite: state.spaceships.get(shipId),
    focusLocation: state.focusLocation,
  }))

  if (!ship || !shipSprite || !player) return <></>

  return (
    <Stack spacing={1}>
      <Box sx={{ color: theme.palette.grayScale.white }}>
        <Stack direction="row" spacing={1}>
          <Box
            onClick={() => focusLocation(shipSprite?.getPosition())}
            sx={{
              width: 84,
              height: 84,
              backgroundColor: theme.palette.grayScale.black,
              border: `4px solid ${theme.palette.grayScale.almostBlack}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src={shipSprite?.shipImg?.texture?.manager?.getBase64(shipSprite?.shipImg?.texture?.key)}
              sx={{ height: 40 }}
            />
          </Box>
          <Box
            p={1}
            sx={{
              backgroundColor: theme.palette.grayScale.almostBlack,
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'start',
            }}
            gap={0.5}
            display="flex"
            flexDirection="column"
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
              }}
            >
              <Box component="img" src={FACTION[player?.faction]?.signSrc} sx={{ height: 28 }} />
              <Typography sx={{ fontFamily: 'VT323', fontSize: 28, lineHeight: 1 }}>
                {player?.name ?? 'Anonymous'}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: 'center',
              }}
            >
              <EnergyStatBox key={ship.energy.value} {...ship.energy} />
              <StatBox title="Planets" value="0" iconSrc="/assets/svg/planet-icon.svg" />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1}>
        <CooldownStatusBadge
          key={ship.cooldown}
          imgSrc="/assets/svg/high-temp-icon.svg"
          finishTimestamp={ship.cooldown}
          hover={{
            title: 'Engine too hot',
            description: 'Unable to move spaceship continuously.',
          }}
        />
      </Stack>
    </Stack>
  )
}
