import { Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useStore } from 'zustand'
import Draggable from 'react-draggable'
import { useMemo } from 'react'
import { generatePlanetName } from '../../../../utils/random'
import { closePlanetModal, gameStore } from '../../../../store/game'
import { dataStore } from '../../../../store/data'
import { GameItem } from '../../common/GameItem'
import { CloseModalButton } from '../../common/CloseModalButton'
import { SaveButton } from '../../common/SaveButton'
import { LevelTag, TypeTag } from '../../common/LabelTag'
import { usePlanet } from '../../../../hook/usePlanet'
import { EnergyStatBox } from '../../Profile/StatBox'

export const PlanetModal = ({ id, position }: { id: string; position: Phaser.Math.Vector2 }) => {
  const theme = useTheme()
  const name = useMemo(() => generatePlanetName(BigInt(id)), [id])
  const planetSprite = useStore(gameStore, (state) => state.planets.get(id))
  const planetLocations = useStore(dataStore, (state) => state.planetLocations.get(id))
  const planet = usePlanet(id)

  if (!planet) return <></>

  return (
    <Draggable
      bounds="body"
      defaultPosition={{
        x: position.x,
        y: position.y,
      }}
    >
      <Box
        position="absolute"
        sx={{
          color: theme.palette.grayScale.white,
          backgroundImage: 'none',
          backgroundColor: theme.palette.grayScale.soBlack,
          width: 300,
          p: 1,
          borderRadius: 2,
          px: 0,
          py: 0,
        }}
      >
        <Stack
          spacing={1}
          sx={{
            px: 1,
            py: 0.5,
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <GameItem imageUrl={planetSprite.texture.manager.getBase64(planetSprite.texture.key)} />
            <Stack pb={1} alignItems="flex-start" flex={1}>
              <Typography sx={{ fontSize: 22, fontWeight: 700, wordBreak: 'break-all', fontFamily: 'VT323' }}>
                {name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LevelTag level={planet.level} />
                <TypeTag type="RESOURCE" />
              </Stack>
            </Stack>
            <CloseModalButton onClick={() => closePlanetModal(id)} />
          </Stack>
          <Stack>
            <Stack direction="row" gap={1}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ height: 36, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
                alignItems="center"
                flex={1}
              >
                <Box component="img" src="/assets/svg/planet-prop-energy.svg" />
                <Typography>{`${planet.energy.value}/${planet.energy.cap}`}</Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ height: 36, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
                alignItems="center"
                flex={1}
              >
                <Box component="img" src="/assets/svg/planet-prop-location.svg" />
                <Typography>{`${planetLocations[0]}, ${planetLocations[1]}`}</Typography>
                <SaveButton onClick={() => console.log('save!')} />
              </Stack>
            </Stack>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              px: 1,
              py: 0.5,
              border: `1px solid ${theme.palette.grayScale.white}`,
              borderRadius: '4px',
              heigh: '32px',
            }}
          >
            <Box component="img" src="/assets/svg/fraction-unknown.svg" />
            <Typography>-</Typography>
          </Box>
          <Stack sx={{ p: 1, backgroundColor: theme.palette.grayScale.black }} spacing={0.5}>
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>Stats</Typography>
            <Box sx={{ p: 1, backgroundColor: theme.palette.grayScale.almostBlack, borderRadius: '4px' }}>
              <Typography sx={{ fontWeight: 400, fontSize: 12, lineHeight: '14px' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna.
                Pellentesque sit amet sapien fringilla, mattis l
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
