import { getComponentValue } from '@latticexyz/recs'
import { Box, Stack, Typography, useTheme } from '@mui/material'
import _ from 'lodash'
import { useMemo, useState } from 'react'
import Draggable from 'react-draggable'
import { useStore } from 'zustand'
import { sendEnergyCost } from '../../../../const/resources'
import { EntityType } from '../../../../const/types'
import { useBaseEntity } from '../../../../hook/useBaseEntity'
import { usePlayer } from '../../../../hook/usePlayer'
import { useResourceRegen } from '../../../../hook/useResourceRegen'
import { TILE_SIZE } from '../../../../layer/phaser/config/chunk'
import { appStore } from '../../../../store/app'
import { closeSendModal, gameStore } from '../../../../store/game'
import { generatePlanetName } from '../../../../utils/random'
import { CloseModalButton } from '../../common/CloseModalButton'
import { GameItem } from '../../common/GameItem'
import { SpriteEntry } from '../AttackModal/SpriteEntry'
import { EnergyInfoTab, InfoTab } from '../PlanetModal/InfoTab'

export const SendModal = ({
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

  const sender = useBaseEntity(id)
  const senderEnergy = useResourceRegen(sender?.entity?.energy)
  const senderOwner = usePlayer(sender?.entity?.owner ?? '0x0')

  const target = useBaseEntity(targetId)
  const targetEnergy = useResourceRegen(target?.entity?.energy)
  const targetOwner = usePlayer(target?.entity?.owner ?? '0x0')

  const [sentEnergy, setSentEnergy] = useState(0)
  const [sentResources, setSentResources] = useState<Map<string, number>>(new Map())

  const { senderName, senderSprite, targetName, targetSprite, senderPosition, targetPosition } = useMemo(() => {
    let senderName: string
    let senderSprite: any
    let senderPosition: Phaser.Math.Vector2
    let targetName: string
    let targetSprite: any
    let targetPosition: Phaser.Math.Vector2

    if (getComponentValue(components.Type, sender?.entity?.index)?.value === EntityType.HQSHIP) {
      senderName = senderOwner?.name
      senderSprite = gameStore.getState().spaceships.get(id)?.shipImg
      senderPosition = gameStore.getState().spaceships.get(id)?.getPosition()
    } else {
      senderName = generatePlanetName(BigInt(id))
      senderSprite = gameStore.getState().planets.get(id)
      senderPosition = senderSprite?.getCenter()
    }

    if (getComponentValue(components.Type, target?.entity?.index)?.value === EntityType.HQSHIP) {
      targetName = targetOwner?.name
      targetSprite = gameStore.getState().spaceships.get(targetId)?.shipImg
      targetPosition = gameStore.getState().spaceships.get(id)?.getPosition()
    } else {
      targetName = generatePlanetName(BigInt(targetId))
      targetSprite = gameStore.getState().planets.get(targetId)
      targetPosition = targetSprite?.getCenter()
    }

    return {
      senderName,
      senderSprite,
      senderPosition,
      targetName,
      targetSprite,
      targetPosition,
    }
  }, [id, sender?.entity?.index, targetId, target?.entity?.index, senderOwner?.name, targetOwner?.name])

  const distance = useMemo(
    () =>
      Math.floor(
        Phaser.Math.Distance.BetweenPoints(
          senderPosition ?? Phaser.Math.Vector2.ZERO,
          targetPosition ?? Phaser.Math.Vector2.ZERO,
        ) / 16,
      ),
    [senderPosition, targetPosition],
  )

  const energyUsed = useMemo(() => {
    return sendEnergyCost(
      distance,
      _.sum([...sentResources.entries()].map((e) => Math.min((target.entity.resources.get(e[0]).value * e[1]) / 100))),
    )
  }, [distance, sentResources])

  if (!sender || !target) return <></>

  return (
    <Draggable
      cancel=".inner-send-modal"
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
            <GameItem imageUrl="/assets/svg/transfer-icon.svg" />
            <Typography sx={{ fontSize: 24, fontWeight: 700, fontFamily: 'VT323', flex: 1 }}>
              Interstellar Transport
            </Typography>
            <CloseModalButton onClick={() => closeSendModal(id)} />
          </Stack>
          <Stack spacing={1} className="inner-send-modal">
            <Stack
              spacing={1}
              direction="row"
              p={1}
              sx={{
                backgroundColor: theme.palette.grayScale.black,
                borderRadius: '8px',
              }}
            >
              <Stack alignItems="center" justifyContent="center">
                <img src="/assets/svg/sending.svg" width={12} draggable={false} />
              </Stack>
              <Stack spacing={1} flex={1}>
                <SpriteEntry
                  sprite={senderSprite}
                  name={senderName}
                  position={{
                    x: Math.floor(senderPosition?.x / TILE_SIZE),
                    y: Math.floor(senderPosition?.y / TILE_SIZE),
                  }}
                  faction={senderOwner?.faction}
                  onClick={() => focusLocation(senderPosition)}
                />
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
              </Stack>
            </Stack>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Target</Typography>
            <Stack direction="row" gap={1}>
              <EnergyInfoTab key={target?.entity?.energy?.value} {...target?.entity?.energy} />
              <InfoTab iconSrc="/assets/svg/shield-icon.svg" title={`${target?.entity?.defense}%`} />
            </Stack>
            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Sender</Typography>
            <Stack direction="row" spacing={1}>
              <InfoTab iconSrc="/assets/svg/distance-icon.svg" title={`${distance} m`} />
              <InfoTab iconSrc="/assets/svg/attack-icon.svg" title={`${sender?.entity?.attack}%`} />
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Draggable>
  )
}
