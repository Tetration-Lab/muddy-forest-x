import { Box, Stack, Typography, useTheme } from '@mui/material'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { useStore } from 'zustand'
import { BASE_BLUEPRINT } from '../../../../const/blueprint'
import { ALL_MATERIALS, MATERIALS } from '../../../../const/materials'
import { maxBuildingPerLevel } from '../../../../const/planet'
import { ENERGY_ID } from '../../../../const/resources'
import { usePlanet } from '../../../../hook/usePlanet'
import { useResourceRegen, useResourcesRegen } from '../../../../hook/useResourceRegen'
import { appStore } from '../../../../store/app'
import { closeBuildModal, gameStore } from '../../../../store/game'
import { generatePlanetName } from '../../../../utils/random'
import { MainButton } from '../../../common/MainButton'
import { ToolButton } from '../../../ToolButton'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'
import { LevelTag, TypeTag } from '../../common/LabelTag'
import { AttackStatTooltip, DefenseStatTooltip } from '../../common/StatTooltip'
import { GameItemEntry } from '../../Modals/PlanetModal/GameItemEntry'
import { StatInfoTab } from '../../Modals/PlanetModal/InfoTab'

export const BuildActionBox = ({ id }: { id: string }) => {
  const theme = useTheme()
  const { api } = useStore(appStore, (state) => state.networkLayer)

  const [selectedBlueprint, setSelectedBlueprint] = useState<number>()
  const blueprint = useMemo(() => BASE_BLUEPRINT[selectedBlueprint], [selectedBlueprint])

  const { planet } = usePlanet(!id ? '0x1' : id)
  const maxBuilding = maxBuildingPerLevel(planet?.level ?? 0)
  const resources = { [ENERGY_ID]: useResourceRegen(planet?.energy), ...useResourcesRegen(planet?.resources) }
  const name = useMemo(() => generatePlanetName(BigInt(id)), [id])
  const { planetSprite, focusLocation } = useStore(gameStore, (state) => ({
    planetSprite: state.planets.get(id),
    focusLocation: state.focusLocation,
  }))

  const isSufficient: { [key in string]: boolean } = useMemo(() => {
    const ent = Object.entries(blueprint?.materials || {}).map(([key, value]) => {
      return [key, (resources[key] ?? 0) >= value]
    })
    return Object.fromEntries(ent)
  }, [resources, blueprint])

  const [isBuilding, setIsBuilding] = useState(false)
  const build = useCallback(async () => {
    try {
      setIsBuilding(true)
      await api.build(id, selectedBlueprint)
    } finally {
      setIsBuilding(false)
    }
  }, [id, selectedBlueprint])

  return (
    <Stack
      p={1}
      sx={{
        background: theme.palette.grayScale.soBlack,
        color: theme.palette.common.white,
        borderRadius: '8px',
        width: 600,
      }}
      spacing={1}
    >
      <Stack direction="row" alignItems="center">
        <ToolButton iconSrc="./assets/svg/build-icon-2.svg" />
        <Typography px={2} sx={{ fontFamily: 'VT323', fontSize: 24, flex: 1 }}>
          Build
        </Typography>
        <CloseModalButton onClick={closeBuildModal} />
      </Stack>

      <Typography variant="body2" sx={{ opacity: 0.7, fontSize: 12 }}>
        Build infrastructure to reinforce planets using blueprints.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Stack flex={1} spacing={1}>
          <Box
            p={1}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              backgroundColor: theme.palette.grayScale.black,
              height: 150,
              overflowY: 'auto',
              borderRadius: '4px',
            }}
          >
            {Object.entries(BASE_BLUEPRINT).map(([id, bp]) => (
              <GameItem
                key={+id}
                imageUrl={bp.imageUrl}
                onClick={() => setSelectedBlueprint((oid) => (oid === +id ? null : +id))}
                active={selectedBlueprint === +id}
              />
            ))}
          </Box>
          <Typography variant="body2" sx={{ fontSize: 12 }}>
            Blueprint requirements:
          </Typography>
          {blueprint
            ? Object.entries(blueprint.materials).map(([mid, mat]) => {
                return (
                  <Stack
                    p={0.5}
                    direction="row"
                    spacing={1}
                    key={mid}
                    sx={{
                      alignItems: 'center',
                      backgroundColor: theme.palette.grayScale.almostBlack,
                      borderRadius: '4px',
                    }}
                  >
                    {isSufficient[mid] ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />}{' '}
                    <GameItem small imageUrl={ALL_MATERIALS[mid]?.imageUrl} />
                    <Typography variant="body2">{ALL_MATERIALS[mid]?.name}</Typography>
                    <Box flex={1} />
                    <Typography variant="body2">
                      {id && <span>{resources[mid]} / </span>}
                      {mat}
                    </Typography>
                  </Stack>
                )
              })
            : _.range(2).map((i) => (
                <Stack
                  p={0.5}
                  direction="row"
                  spacing={1}
                  key={i}
                  sx={{
                    alignItems: 'center',
                    backgroundColor: theme.palette.grayScale.almostBlack,
                    borderRadius: '4px',
                  }}
                >
                  <GameItem small imageUrl="/assets/svg/materials/random.svg" />
                  <Typography variant="body2">???</Typography>
                </Stack>
              ))}
        </Stack>
        <Stack
          flex={1}
          sx={{
            backgroundColor: theme.palette.grayScale.black,
            border: `1px solid ${theme.palette.grayScale.almostBlack}`,
            borderRadius: '8px',
            position: 'relative',
          }}
          px={1}
          pb={1}
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <GameItem
              imageUrl={
                planetSprite?.texture?.manager?.getBase64(planetSprite?.texture?.key) ?? '/assets/empty-build.png'
              }
              onClick={() => {
                if (planetSprite) focusLocation(planetSprite?.getCenter())
              }}
            />
            <Stack pb={1} alignItems="flex-start" flex={1}>
              <Typography sx={{ fontSize: 24, fontWeight: 700, wordBreak: 'break-all', fontFamily: 'VT323' }}>
                {!id ? '???' : name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LevelTag level={planet?.level ?? 0} />
                <TypeTag type="RESOURCE" />
              </Stack>
            </Stack>
          </Stack>
          <Typography variant="body2">After built:</Typography>
          <Stack spacing={0.5}>
            <StatInfoTab
              title="Energy"
              iconSrc="/assets/svg/item-energy-icon.svg"
              value={
                <>
                  <span style={{ color: theme.palette.grayScale.almostDarkGray }}>Max</span> {planet?.energy?.cap}
                  {blueprint && blueprint.bonus.resources[ENERGY_ID]?.cap > 0 && (
                    <span
                      style={{
                        color: theme.palette.common.green,
                      }}
                    >
                      {' '}
                      (+{blueprint.bonus.resources[ENERGY_ID]?.cap})
                    </span>
                  )}
                  {'\n'}
                  <span style={{ fontSize: 14 }}>
                    +{planet?.energy?.rpb}
                    {blueprint && blueprint.bonus.resources[ENERGY_ID]?.rpb > 0 && (
                      <span
                        style={{
                          color: theme.palette.common.green,
                        }}
                      >
                        {' '}
                        (+{blueprint.bonus.resources[ENERGY_ID]?.rpb}){' '}
                      </span>
                    )}
                    /s
                  </span>
                </>
              }
            />
            <StatInfoTab
              title="Attack"
              iconSrc="/assets/svg/attack-icon.svg"
              tooltip={<AttackStatTooltip />}
              value={
                <>
                  {planet?.attack ?? 0}{' '}
                  {blueprint && blueprint.bonus.attack > 0 && (
                    <span
                      style={{
                        color: theme.palette.common.green,
                      }}
                    >
                      (+{blueprint.bonus.attack / 100}){' '}
                    </span>
                  )}
                  %
                </>
              }
            />
            <StatInfoTab
              title="Defense"
              iconSrc="/assets/svg/shield-icon.svg"
              tooltip={<DefenseStatTooltip />}
              value={
                <>
                  {planet?.defense ?? 0}{' '}
                  {blueprint && blueprint.bonus.defense > 0 && (
                    <span
                      style={{
                        color: theme.palette.common.green,
                      }}
                    >
                      (+{blueprint.bonus.defense / 100}){' '}
                    </span>
                  )}
                  %
                </>
              }
            />
          </Stack>
          {Object.entries(blueprint?.bonus?.resources ?? {}).filter((e) => e[0] !== ENERGY_ID).length > 0 && (
            <>
              <Typography variant="body2">Materials:</Typography>
              <Stack spacing={0.5}>
                {Object.entries(blueprint?.bonus?.resources ?? {})
                  .filter((e) => e[0] !== ENERGY_ID)
                  .map(([id, res]) => (
                    <GameItemEntry
                      key={id}
                      iconUrl={MATERIALS[id]?.imageUrl}
                      title={MATERIALS[id]?.name}
                      description={
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontSize={12} color={theme.palette.grayScale.almostDarkGray}>
                            +{planet?.resources?.get(id)?.rpb ?? 0}
                            {res.rpb > 0 && <span style={{ color: theme.palette.common.green }}> (+{res.rpb}) </span>}
                            /s
                          </Typography>
                          <Typography fontSize={12} color={theme.palette.grayScale.white}>
                            <span style={{ color: theme.palette.grayScale.almostDarkGray }}>Max </span>
                            {planet?.resources?.get(id)?.cap ?? 0}
                            {res.cap > 0 && <span style={{ color: theme.palette.common.green }}> (+{res.cap}) </span>}
                          </Typography>
                        </Stack>
                      }
                    />
                  ))}
              </Stack>
            </>
          )}
          <Stack direction="row" justifyContent="center">
            <MainButton
              onClick={build}
              disabled={
                isBuilding ||
                !selectedBlueprint ||
                !id ||
                !planet ||
                planet.buildings.length >= maxBuilding ||
                Object.values(isSufficient).some((e) => !e)
              }
            >
              Build
            </MainButton>
          </Stack>
          <Stack
            display={!id ? 'flex' : 'none'}
            sx={{
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                backgroundColor: theme.palette.grayScale.black,
                opacity: 0.7,
              }}
            />
            <Typography p={1} sx={{ position: 'absolute', fontSize: 18, textAlign: 'center' }}>
              Please select a planet from the space map
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
