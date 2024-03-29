import { getComponentValue } from '@latticexyz/recs'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'zustand'
import { attackEnergyCost } from '../../../../const/resources'
import { EntityType } from '../../../../const/types'
import { useBaseEntity } from '../../../../hook/useBaseEntity'
import { usePlayer } from '../../../../hook/usePlayer'
import { useResourceRegen } from '../../../../hook/useResourceRegen'
import { TILE_SIZE } from '../../../../layer/phaser/config/chunk'
import { appStore } from '../../../../store/app'
import { closeAttackModal, gameStore } from '../../../../store/game'
import { generatePlanetName } from '../../../../utils/random'
import { MainButton } from '../../../common/MainButton'
import { WarningBox } from '../../../common/WarningBox'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'
import { EnergyInfoTab, InfoTab } from '../PlanetModal/InfoTab'
import { GameItemSlider } from './GameItemSlider'
import { SpriteEntry } from './SpriteEntry'

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
  const { components, api } = useStore(appStore, (state) => state.networkLayer)
  const focusLocation = useStore(gameStore, (state) => state.focusLocation)

  const attacker = useBaseEntity(id)
  const attackerEnergy = useResourceRegen(attacker?.entity?.energy)
  const attackerOwner = usePlayer(attacker?.entity?.owner ?? '0x0')

  const target = useBaseEntity(targetId)
  const targetEnergy = useResourceRegen(target?.entity?.energy)
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
      targetPosition = gameStore.getState().spaceships.get(targetId)?.getPosition()
    } else {
      targetName = generatePlanetName(BigInt(targetId))
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

  const [energyUsedPercent, setEnergyUsedPercent] = useState(50)

  const effectiveEnergy = useMemo(() => {
    const energy = Math.floor(
      (((energyUsedPercent * attackerEnergy) / 100) * attacker?.entity?.attack) / target?.entity?.defense,
    )
    return Math.max(0, energy - attackEnergyCost(distance))
  }, [distance, energyUsedPercent, attackerEnergy, attacker?.entity?.attack, target?.entity?.defense])

  const [isAttacking, setAttacking] = useState(false)
  const attack = useCallback(async () => {
    setAttacking(true)
    try {
      const tx = await api.attack(id, targetId, Math.floor((energyUsedPercent * attackerEnergy) / 100), distance)
      await tx.wait()
      const ship = gameStore.getState().spaceships.get(id)
      if (ship) {
        ship.clearLine()
      }
      const planet = gameStore.getState().planets.get(id)
      if (planet) {
        planet.clearLine()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAttacking(false)
    }
  }, [id, targetId, energyUsedPercent, attackerEnergy, distance])

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
          borderRadius: 2,
          px: 0,
          py: 1,
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
            <SpriteEntry
              sprite={targetSprite}
              name={targetName}
              position={{
                x: Math.floor(targetPosition?.x / TILE_SIZE),
                y: Math.floor(targetPosition?.y / TILE_SIZE),
              }}
              faction={targetOwner?.faction}
              onClick={() => focusLocation(targetPosition)}
            />
            <Stack direction="row" gap={1}>
              <EnergyInfoTab key={target?.entity?.energy?.value} {...target?.entity?.energy} />
              <InfoTab iconSrc="/assets/svg/shield-icon.svg" title={`${target?.entity?.defense}%`} />
            </Stack>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Attacker</Typography>
            <SpriteEntry
              sprite={attackerSprite}
              name={attackerName}
              position={{
                x: Math.floor(attackerPosition?.x / TILE_SIZE),
                y: Math.floor(attackerPosition?.y / TILE_SIZE),
              }}
              faction={attackerOwner?.faction}
              onClick={() => focusLocation(attackerPosition)}
            />
            <Stack direction="row" spacing={1}>
              <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
              <InfoTab iconSrc="/assets/svg/attack-icon.svg" title={`${attacker?.entity?.attack}%`} />
            </Stack>
            {attackerOwner?.faction === targetOwner?.faction ? (
              <WarningBox label="Cannot attack your own faction!" />
            ) : (
              <Stack p={1} sx={{ backgroundColor: theme.palette.grayScale.darkGray, borderRadius: '8px' }} spacing={1}>
                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Energy Used</Typography>
                <GameItemSlider
                  imageUrl="/assets/svg/item-energy-icon.svg"
                  value={
                    <>
                      {attackerEnergy}{' '}
                      <span
                        style={{
                          color: theme.palette.error.main,
                        }}
                      >
                        (-{Math.floor((energyUsedPercent * attackerEnergy) / 100)})
                      </span>{' '}
                      / {attacker?.entity?.energy?.cap}
                    </>
                  }
                  percent={energyUsedPercent}
                  onChangePercent={setEnergyUsedPercent}
                />
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
                      {targetEnergy}{' '}
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
                  <MainButton color="error" onClick={attack} disabled={isAttacking || effectiveEnergy <= 0}>
                    Attack
                  </MainButton>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
