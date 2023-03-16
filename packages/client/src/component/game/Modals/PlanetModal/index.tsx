import { Collapse, Grid, IconButton, Typography, useTheme } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useStore } from 'zustand'
import Draggable from 'react-draggable'
import { useEffect, useMemo } from 'react'
import { generatePlanetName } from '../../../../utils/random'
import { closePlanetModal, gameStore } from '../../../../store/game'
import { dataStore } from '../../../../store/data'
import { GameItem } from '../../common/GameItem'
import { CloseModalButton } from '../../common/CloseModalButton'
import { SaveButton } from '../../common/SaveButton'
import { LevelTag, TypeTag } from '../../common/LabelTag'
import { usePlanet } from '../../../../hook/usePlanet'
import { usePlayer } from '../../../../hook/usePlayer'
import { EnergyInfoTab, FactionInfoTab, InfoTab, StatInfoTab } from './InfoTab'
import { appStore } from '../../../../store/app'
import { maxBuildingPerLevel } from '../../../../const/planet'
import { MainButton } from '../../../common/MainButton'
import { MaterialEntry } from './MaterialEntry'
import { useBoolean } from 'usehooks-ts'
import { FaAngleDown } from 'react-icons/fa'
import { GAME_UI_STATE } from '../../../../layer/phaser/scene/GameScene'

export const PlanetModal = ({ id, position }: { id: string; position: Phaser.Math.Vector2 }) => {
  const theme = useTheme()
  const { network } = useStore(appStore, (state) => state.networkLayer)
  const name = useMemo(() => generatePlanetName(BigInt(id)), [id])
  const { planetSprite, focusLocation } = useStore(gameStore, (state) => ({
    planetSprite: state.planets.get(id),
    focusLocation: state.focusLocation,
  }))
  const planetLocations = useStore(dataStore, (state) => state.planetLocations.get(id))
  const { planet, uninitilizedResources } = usePlanet(id)
  const owner = usePlayer(planet?.owner ?? '0x0')
  const isOwner = useMemo(() => planet?.owner === network.connectedAddress.get(), [planet?.owner])
  const maxBuildings = useMemo(() => maxBuildingPerLevel(planet?.level ?? 0), [planet?.level])
  const isResourceExpanded = useBoolean(true)

  const onAttack = () => {
    const gameScene = appStore.getState().gameScene
    if (gameScene) {
      gameScene.clearGameUIState()
      gameScene.clearAllDrawLine()
      setTimeout(() => {
        gameScene.targetPlanet = planetSprite
        gameScene.gameUIState = GAME_UI_STATE.SELECTED_PLANET
      }, 100)
    }
  }

  const onSend = () => {
    const gameScene = appStore.getState().gameScene
    if (gameScene) {
      setTimeout(() => {
        gameScene.targetPlanet = planetSprite
        gameScene.drawPlanetSends.set(planetSprite.entityID, planetSprite)
        gameScene.gameUIState = GAME_UI_STATE.SELECTED_PLANET_SEND
      }, 100)
    }
  }

  useEffect(() => {
    console.log(planet?.owner, 'owner')
    planetSprite.setOwner(false)
    if (planet?.owner) {
      planetSprite.setOwner(true)
    }
  }, [planet?.owner])

  if (!planet || !planetSprite) return <></>

  return (
    <Draggable
      cancel=".inner-planet-modal"
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
          pt: 0,
          pb: 1,
        }}
      >
        <Stack
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
            <GameItem
              imageUrl={planetSprite?.texture?.manager?.getBase64(planetSprite?.texture?.key)}
              onClick={() => focusLocation(planetSprite.getCenter())}
            />
            <Stack pb={1} alignItems="flex-start" flex={1}>
              <Typography sx={{ fontSize: 24, fontWeight: 700, wordBreak: 'break-all', fontFamily: 'VT323' }}>
                {name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LevelTag level={planet.level} />
                <TypeTag type="RESOURCE" />
              </Stack>
            </Stack>
            <CloseModalButton onClick={() => closePlanetModal(id)} />
          </Stack>
          <Stack spacing={1} className="inner-planet-modal">
            <Stack>
              <Stack direction="row" gap={1}>
                <EnergyInfoTab key={planet.energy.value} {...planet.energy} />
                <InfoTab
                  iconSrc="/assets/svg/location-icon.svg"
                  title={`${planetLocations[0]},${planetLocations[1]}`}
                  suffix={<SaveButton onClick={() => console.log('save!')} />}
                />
              </Stack>
            </Stack>
            <FactionInfoTab faction={owner.faction} name={owner.name} isYou={isOwner} />
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Stats:</Typography>
            <Stack sx={{ p: 1, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }} spacing={0.5}>
              <StatInfoTab iconSrc="/assets/svg/attack-icon.svg" title="Attack" value={planet.attack} />
              <StatInfoTab iconSrc="/assets/svg/shield-icon.svg" title="Defense" value={planet.defense} />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{`Materials:`}</Typography>
              <IconButton
                onClick={() => isResourceExpanded.toggle()}
                size="small"
                sx={{
                  p: 0,
                  transform: !isResourceExpanded.value ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.1s ease-in-out',
                }}
              >
                <FaAngleDown />
              </IconButton>
            </Stack>
            <Box m={-1}>
              <Collapse in={isResourceExpanded.value} unmountOnExit>
                <Grid container spacing={1}>
                  {[...planet.resources.entries()].map((r) => (
                    <Grid item xs={12} flex={1} key={r[0]}>
                      <MaterialEntry id={r[0]} resource={r[1]} disabled={uninitilizedResources.includes(r[0])} />
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 400 }}
            >{`Buildings: ${planet.buildings.length}/${maxBuildings}`}</Typography>
            <Stack
              sx={{ p: 1, backgroundColor: theme.palette.grayScale.black, borderRadius: '4px' }}
              spacing={0.5}
            ></Stack>
            {isOwner && (
              <Stack direction="row" spacing={1} justifyContent="center">
                <MainButton onClick={() => onAttack()}>Attack</MainButton>
                <MainButton onClick={() => onSend()}>Send</MainButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
