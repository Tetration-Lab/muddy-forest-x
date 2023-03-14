import { getComponentValue } from '@latticexyz/recs'
import { Box, Slider, Stack, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'zustand'
import { FACTION } from '../../../../const/faction'
import { attackEnergyCost } from '../../../../const/resources'
import { EntityType } from '../../../../const/types'
import { useBaseEntity } from '../../../../hook/useBaseEntity'
import { usePlayer } from '../../../../hook/usePlayer'
import { TILE_SIZE } from '../../../../layer/phaser/config/chunk'
import { appStore } from '../../../../store/app'
import { closeAttackModal, gameStore } from '../../../../store/game'
import { generatePlanetName } from '../../../../utils/random'
import { MainButton } from '../../../common/MainButton'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'
import { GameItemEntry } from '../PlanetModal/GameItemEntry'
import { EnergyInfoTab, InfoTab } from '../PlanetModal/InfoTab'

export const AttackModal = ({
  id,
  targetId,
  position,
}: {
  id: string
  targetId: string
  position: Phaser.Math.Vector2
}) => {
  const theme = useTheme()
  const { components } = useStore(appStore, (state) => state.networkLayer)
  const focusLocation = useStore(gameStore, (state) => state.focusLocation)

  const attacker = useBaseEntity(id)
  const target = useBaseEntity(targetId)
  const attackerOwner = usePlayer(attacker?.entity?.owner ?? '0x0')
  const targetOwner = usePlayer(target?.entity?.owner ?? '0x0')

  const { attackerName, attackerSprite, targetName, targetSprite, attackerPosition, targetPosition } = useMemo(() => {
    let attackerName: string
    let attackerSprite: any
    let attackerPosition: Phaser.Math.Vector2
    let targetName: string
    let targetSprite: any
    let targetPosition: Phaser.Math.Vector2

    if (getComponentValue(components.Type, attacker?.entity?.index)?.value === EntityType.HQSHIP) {
      attackerName = attackerOwner?.name
      attackerSprite = gameStore.getState().spaceships.get(id)?.shipImg
      attackerPosition = gameStore.getState().spaceships.get(id)?.getPosition()
    } else {
      attackerName = generatePlanetName(BigInt(id))
      attackerSprite = gameStore.getState().planets.get(id)
      attackerPosition = attackerSprite?.getCenter()
    }

    if (getComponentValue(components.Type, target?.entity?.index)?.value === EntityType.HQSHIP) {
      targetName = targetOwner?.name
      targetSprite = gameStore.getState().spaceships.get(targetId)?.shipImg
      targetPosition = gameStore.getState().spaceships.get(id)?.getPosition()
    } else {
      targetName = generatePlanetName(BigInt(id))
      targetSprite = gameStore.getState().planets.get(targetId)
      targetPosition = targetSprite?.getCenter()
    }

    return {
      attackerName,
      attackerSprite,
      attackerPosition,
      targetName,
      targetSprite,
      targetPosition,
    }
  }, [id, attacker?.entity?.index, targetId, target?.entity?.index, attackerOwner?.name, targetOwner?.name])

  const distance = useMemo(
    () =>
      Math.floor(
        Phaser.Math.Distance.BetweenPoints(
          attackerPosition ?? Phaser.Math.Vector2.ZERO,
          targetPosition ?? Phaser.Math.Vector2.ZERO,
        ) / 16,
      ),
    [attackerPosition, targetPosition],
  )

  const [energyUsedPercent, setEnergyUsedPercent] = useState(0)

  const effectiveEnergy = useMemo(() => {
    const energy = Math.floor(
      (((energyUsedPercent * attacker?.entity?.energy?.value) / 100) * attacker?.entity?.attack) /
        target?.entity?.defense,
    )
    return Math.max(0, energy - attackEnergyCost(distance))
  }, [distance, energyUsedPercent, attacker?.entity?.energy?.value, attacker?.entity?.attack, target?.entity?.defense])

  if (!attacker || !target) return <></>

  return (
    <Draggable
      cancel=".inner-attack-modal"
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
          spacing={1}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <GameItem imageUrl="/assets/svg/attack-icon.svg" />
            <Typography sx={{ fontSize: 24, fontWeight: 700, wordBreak: 'break-all', fontFamily: 'VT323', flex: 1 }}>
              Attack
            </Typography>
            <CloseModalButton onClick={() => closeAttackModal(id)} />
          </Stack>
          <Stack spacing={1} className="inner-attack-modal">
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Target</Typography>
            <GameItemEntry
              iconUrl={targetSprite?.texture?.manager?.getBase64(targetSprite?.texture?.key)}
              title={targetName}
              description={`${Math.floor(targetPosition?.x / TILE_SIZE)}, ${Math.floor(targetPosition?.y / TILE_SIZE)}`}
              onClick={() => focusLocation(targetPosition)}
              sx={{
                border: `2px solid ${FACTION[targetOwner?.faction]?.color}`,
                borderStyle: 'outset',
              }}
            />
            <Stack direction="row" gap={1}>
              <EnergyInfoTab key={target?.entity?.energy?.value} {...target?.entity?.energy} />
              <InfoTab iconSrc="/assets/svg/shield-icon.svg" title={`${target?.entity?.defense}%`} />
            </Stack>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Attacker</Typography>
            <GameItemEntry
              iconUrl={attackerSprite?.texture?.manager?.getBase64(attackerSprite?.texture?.key)}
              title={attackerName}
              description={`${Math.floor(attackerPosition?.x / TILE_SIZE)}, ${Math.floor(
                attackerPosition?.y / TILE_SIZE,
              )}`}
              onClick={() => focusLocation(attackerPosition)}
              sx={{
                border: `2px solid ${FACTION[attackerOwner?.faction]?.color}`,
                borderStyle: 'outset',
              }}
            />
            <Stack direction="row" spacing={1}>
              <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
              <InfoTab iconSrc="/assets/svg/attack-icon.svg" title={`${attacker?.entity?.attack}%`} />
            </Stack>
            <Stack p={1} sx={{ backgroundColor: theme.palette.grayScale.darkGray, borderRadius: '8px' }} spacing={1}>
              <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Energy Used</Typography>
              <Stack
                direction="row"
                spacing={1}
                p={0.5}
                sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '8px' }}
              >
                <GameItem imageUrl="/assets/svg/item-energy-icon.svg" />
                <Stack flex={1} justifyContent="center" alignItems="end">
                  <Typography sx={{ fontSize: 14 }}>
                    {Math.floor((energyUsedPercent * attacker?.entity?.energy?.value) / 100)}/
                    {attacker?.entity?.energy?.cap}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center" width="100%">
                    <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>0%</Typography>
                    <Slider
                      aria-label="energy-used"
                      value={energyUsedPercent}
                      valueLabelDisplay="auto"
                      onChange={(_, value) => {
                        setEnergyUsedPercent(value as number)
                      }}
                      size="small"
                      sx={{ color: theme.palette.grayScale.white, p: 0 }}
                    />
                    <Typography sx={{ fontSize: 14, color: theme.palette.grayScale.almostGray }}>100%</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Typography sx={{ fontSize: 14 }}>Final Damage</Typography>
              <Typography sx={{ fontSize: 12, color: theme.palette.grayScale.almostGray }}>
                The target will be{' '}
                <span
                  style={{
                    color: theme.palette.error.main,
                  }}
                >
                  defeated{' '}
                </span>{' '}
                if use more than current target's energy
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                p={0.5}
                sx={{ backgroundColor: theme.palette.grayScale.black, borderRadius: '8px' }}
              >
                <GameItem imageUrl="/assets/svg/item-minus-energy-icon.svg" />
                <Stack flex={1} justifyContent="center" alignItems="end">
                  <Typography sx={{ fontSize: 14 }}>
                    {target?.entity?.energy?.value}{' '}
                    <span
                      style={{
                        color: theme.palette.error.main,
                      }}
                    >
                      (-{effectiveEnergy}){' '}
                    </span>
                    / {target?.entity?.energy?.cap}
                  </Typography>
                </Stack>
              </Stack>
              <Stack alignItems="center">
                <MainButton color="error" sx={{ width: 'fit-content' }}>
                  Attack
                </MainButton>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
