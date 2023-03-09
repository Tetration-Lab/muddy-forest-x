import { formatEntityID } from '@latticexyz/network'
import { Box, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useEffect } from 'react'
import { useStore } from 'zustand'
import { FACTION } from '../../../const/faction'
import { dataStore } from '../../../store/data'
import { gameStore } from '../../../store/game'
import { EnergyStatBox, StatBox } from './StatBox'
import { CooldownStatusBadge, StatusBadge } from './StatusBadge'

export const Profile = () => {
  const theme = useTheme()
  const { ship, shipId, player } = useStore(dataStore, (state) => {
    const shipId = state.ownedSpaceships[0]
    const ship = state.spaceships.get(shipId)
    const player = state.players.get(formatEntityID(ship?.owner ?? '0x0'))
    return {
      shipId,
      ship,
      player,
    }
  })
  const shipSprite = useStore(gameStore, (state) => state.spaceships.get(shipId))

  if (!ship || !shipSprite || !player) return <></>
  return (
    <Stack spacing={1}>
      <Box sx={{ color: theme.palette.grayScale.white }}>
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              width: 84,
              height: 84,
              backgroundColor: theme.palette.grayScale.black,
              border: `4px solid ${theme.palette.grayScale.almostBlack}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              src={shipSprite?.texture?.manager?.getBase64(shipSprite?.texture?.key)}
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
              <EnergyStatBox
                value={ship.energy.value}
                cap={ship.energy.cap}
                regen={ship.energy.rpb}
                latestRegen={ship.energy.lrt}
              />
              <StatBox title="Planets" value="0" iconSrc="/assets/svg/planet-icon.svg" />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Stack direction="row" spacing={1}>
        <CooldownStatusBadge
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
